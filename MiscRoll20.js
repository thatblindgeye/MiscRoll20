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

    let [, brightDistance, dimDistance] = message.content.split(" ");
    brightDistance = calculateDistance(brightDistance);
    dimDistance = calculateDistance(dimDistance);

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
          if (/^!massHP/i.test(message.content) && selectedTokens.length) {
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
    registerEventHandlers,
  };
})();

on("ready", () => {
  "use strict";

  MiscScripts.registerEventHandlers();
});
