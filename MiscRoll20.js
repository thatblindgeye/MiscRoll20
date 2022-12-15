const MiscScripts = (function () {
  "use strict";

  const MISC_DISPLAY_NAME = "Misc Scripts";

  function getCleanImgsrc(imgsrc) {
    const parts = imgsrc.match(
      /(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/
    );

    if (parts) {
      return (
        parts[1] +
        "thumb" +
        parts[3] +
        (parts[4] ? parts[4] : `?${Math.round(Math.random() * 9999999)}`)
      );
    }

    throw new Error(
      `The selected token does not have a valid image source. A token's image cannot be the default image, and the selected token cannot be one that was purchased on the Roll20 marketplace.`
    );
  }

  function getMacroByName(macroName) {
    return findObjs(
      { _type: "macro", name: macroName },
      { caseInsensitive: true }
    );
  }

  const MACROS = [
    {
      name: "Initiative-Passes",
      action: "!initPasses",
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: "Mass-HP",
      action:
        '!masshp ?{Change HP by - must be an integer or "-" followed by an integer, e.g. -5} ?{HP bar|Bar 1,bar1|Bar 2,bar2|Bar 3,bar3}',
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: "Light-Custom",
      action:
        "!light ?{Distance of bright light - enter 0 to turn off bright light|0} ?{Distance of dim light - enter 0 to turn off dim light|0} ?{Direction of light - enter 0 to turn off directional light|0}",
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: "Light-Item",
      action:
        "!light ?{Light source|Turn off,0 0|Candle,5 5|Lamp,15 30|Lantern (Bullseye),60 60 90|Lantern (Hooded),30 30|Torch,20 20}",
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: "Dancing-Dragon",
      action:
        "!dancingdragon ?{Stance to assume|High Stance,High-Stance|Low Stance,Low-Stance|Power Stance,Power-Stance|Off}",
      gmOnly: false,
      istokenaction: true,
    },
  ];

  function createMiscMacros() {
    _.each(MACROS, (macro) => {
      const currentMacro = getMacroByName(macro.name);
      const gmPlayers = _.filter(
        findObjs({
          _type: "player",
        }),
        (player) => playerIsGM(player.get("_id"))
      );

      if (!currentMacro.length) {
        const { name, action, gmOnly, istokenaction } = macro;

        createObj("macro", {
          _playerid: gmPlayers[0].get("_id"),
          name,
          action,
          visibleto: gmOnly ? _.pluck(gmPlayers, "id").join(",") : "all",
          istokenaction,
        });
      }
    });
  }

  function initiativePassScript() {
    const currentTurnorder =
      Campaign().get("turnorder") === ""
        ? []
        : JSON.parse(Campaign().get("turnorder"));

    const initiativePasses = [];

    _.each(currentTurnorder, (turnorderItem) => {
      let currentInit = parseInt(turnorderItem.pr);

      while (currentInit > 0) {
        initiativePasses.push({ ...turnorderItem, pr: currentInit });
        currentInit -= 10;
      }
    });

    Campaign().set("turnorder", JSON.stringify(initiativePasses));
  }

  function massHitpointsScript(message) {
    let [, hpChange, tokenBar] = message.content.split(" ");
    hpChange = parseInt(hpChange);

    _.each(message.selected, (selected) => {
      const token = getObj("graphic", selected._id);
      const currentHP = parseInt(token.get(`${tokenBar}_value`));

      token.set(`${tokenBar}_value`, currentHP + hpChange);
      BarThresholds.runThresholds(tokenBar, selected, currentHP);
    });
  }

  function lightScript(message) {
    const calculateDistance = (distance) =>
      isNaN(parseInt(distance)) ? 10 : parseInt(distance);

    let [, brightDistance, dimDistance, lightDirection] =
      message.content.split(" ");
    brightDistance = calculateDistance(brightDistance);
    dimDistance = calculateDistance(dimDistance);
    lightDirection = parseInt(lightDirection);

    _.each(message.selected, (selected) => {
      const token = getObj("graphic", selected._id);

      if (brightDistance > 0) {
        token.set({
          emits_bright_light: true,
          bright_light_distance: brightDistance,
        });
      } else {
        token.set({
          emits_bright_light: false,
        });
      }

      if (dimDistance > 0) {
        token.set({
          emits_low_light: true,
          low_light_distance: brightDistance + dimDistance,
        });
      } else {
        token.set({
          emits_low_light: false,
        });
      }

      if (lightDirection && lightDirection > 0) {
        token.set({
          has_directional_bright_light: true,
          directional_bright_light_total: lightDirection,
          has_directional_dim_light: true,
          directional_dim_light_total: lightDirection,
        });
      } else {
        token.set({
          has_directional_bright_light: false,
          has_directional_dim_light: false,
        });
      }
    });
  }

  function getImgsrcScript(selectedTokens) {
    const imgsrcList = _.map(selectedTokens, (selected) => {
      const token = getObj("graphic", selected._id);
      const tokenImg = token.get("imgsrc");

      return `<div style="border: 1px solid gray; padding: 2px;"><div style="width: 70px; height: 70px;"><img src="${tokenImg}" alt="Token image" /></div>${getCleanImgsrc(
        tokenImg
      )}</div>`;
    }).join("");

    sendChat(MISC_DISPLAY_NAME, `/w gm ${imgsrcList}`, null, {
      noarchive: true,
    });
  }

  function dancingDragonScript(message) {
    const stance = message.content.split(" ")[1].replace("-", " ");
    const token = getObj("graphic", message.selected[0]._id);

    if (token.get("tooltip").includes(stance)) {
      sendChat("", `/em ${token.get("name")} remains in the ${stance}!`);
      return;
    }

    ConditionTracker.updateConditionInstances(
      "remove",
      "high stance, power stance, low stance",
      [token]
    );

    if (stance.toLowerCase() !== "off") {
      ConditionTracker.updateConditionInstances("add", stance, [token]);
      sendChat("", `/em ${token.get("name")} takes the ${stance}!`);
    } else {
      sendChat("", `/em ${token.get("name")} has exited the Dancing Dragon!`);
    }
  }

  function registerEventHandlers() {
    on("chat:message", (message) => {
      if (message.type === "api") {
        if (/^!light/i.test(message.content) && message.selected) {
          lightScript(message);
        }

        if (/^!dancingdragon/i.test(message.content) && message.selected) {
          dancingDragonScript(message);
        }

        if (playerIsGM(message.playerid)) {
          const selectedTokens = message.selected;
          if (/^!masshp/i.test(message.content) && selectedTokens.length) {
            massHitpointsScript(message);
          }
          if (/^!initPasses/i.test(message.content)) {
            initiativePassScript();
          }

          if (/^!getimgsrc/i.test(message.content) && selectedTokens.length) {
            getImgsrcScript(selectedTokens);
          }
        }
      }
    });
  }

  return {
    createMiscMacros,
    registerEventHandlers,
  };
})();

on("ready", () => {
  "use strict";

  MiscScripts.createMiscMacros();
  MiscScripts.registerEventHandlers();
});
