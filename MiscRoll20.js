const MiscScripts = (function () {
  "use strict";

  const MISC_DISPLAY_NAME = "Misc Scripts";

  function getCleanImgsrc(token) {
    const imgsrc = token.get("imgsrc");
    const parts = imgsrc.match(
      /(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/
    );

    if (parts) {
      const imgURL =
        parts[1] +
        "thumb" +
        parts[3] +
        (parts[4] ? parts[4] : `?${Math.round(Math.random() * 9999999)}`);

      return `<div style="padding: 8px; border: 1px solid gray; border-radius: 25px;"><img src="${imgURL}" alt="${token.get(
        "name"
      )} token"/><div><code>${imgURL}</code></div></div>`;
    }

    throw new Error(
      `The selected token does not have a valid image source. A token's image cannot be the default image, and the selected token cannot be one that was purchased on the Roll20 marketplace.`
    );
  }

  const HEX_COLORS = {
    Black: "#000000",
    Blue: "#0000ff",
    "--Blue (dark)": "#0000cc",
    "--Blue (darker)": "#000099",
    "--Blue (darkest)": "#000066",
    "--Blue (light)": "#3333ff",
    "--Blue (lighter)": "#6666ff",
    "--Blue (lightest)": "#9999ff",
    Brown: "#a52a2a",
    "--Brown (dark)": "#7e2020",
    "--Brown (darker)": "#551616",
    "--Brown (darkest)": "#2d0c0c",
    "--Brown (light)": "#ce4040",
    "--Brown (lighter)": "#da7171",
    "--Brown (lightest)": "#ebb2b2",
    Cyan: "#00ffff",
    "--Cyan (dark)": "#00cccc",
    "--Cyan (darker)": "#009999",
    "--Cyan (darkest)": "#006666",
    "--Cyan (light)": "#33ffff",
    "--Cyan (lighter)": "#66ffff",
    "--Cyan (lightest)": "#99ffff",
    Gray: "#808080",
    "--Gray (dark)": "#666666",
    "--Gray (darker)": "#4d4d4d",
    "--Gray (darkest)": "#333333",
    "--Gray (light)": "#999999",
    "--Gray (lighter)": "#b3b3b3",
    "--Gray (lightest)": "#cccccc",
    Green: "#008000",
    "--Green (dark)": "#006600",
    "--Green (darker)": "#004d00",
    "--Green (darkest)": "#003300",
    "--Green (light)": "#00cc00",
    "--Green (lighter)": "#33ff33",
    "--Green (lightest)": "#99ff99",
    Magenta: "#ff00ff",
    "--Magenta (dark)": "#cc00cc",
    "--Magenta (darker)": "#990099",
    "--Magenta (darkest)": "#660066",
    "--Magenta (light)": "#ff33ff",
    "--Magenta (lighter)": "#ff66ff",
    "--Magenta (lightest)": "#ff99ff",
    Orange: "#ffa500",
    "--Orange (dark)": "#cc8500",
    "--Orange (darker)": "#996300",
    "--Orange (darkest)": "#664200",
    "--Orange (light)": "#ffb833",
    "--Orange (lighter)": "#ffc966",
    "--Orange (lightest)": "#ffdb99",
    Pink: "#ffc0cb",
    Purple: "#800080",
    Red: "#ff0000",
    "--Red (dark)": "#cc0000",
    "--Red (darker)": "#990000",
    "--Red (darkest)": "#660000",
    "--Red (light)": "#ff3333",
    "--Red (lighter)": "#ff6666",
    "--Red (lightest)": "#ff9999",
    Transparent: "transparent",
    Violet: "#ee82ee",
    "--Violet (dark)": "#e228e2",
    "--Violet (darker)": "#901490",
    "--Violet (darkest)": "#360736",
    "--Violet (light)": "#f3a5f3",
    "--Violet (lighter)": "#f8c9f8",
    "--Violet (lightest)": "#fdedfd",
    White: "#ffffff",
    Yellow: "#ffff00",
    "--Yellow (dark)": "#cccc00",
    "--Yellow (darker)": "#999900",
    "--Yellow (darkest)": "#666600",
    "--Yellow (light)": "#ffff33",
    "--Yellow (lighter)": "#ffff66",
    "--Yellow (lightest)": "#ffff99",
  };

  const MACROS = [
    {
      name: "Get-Clean-Imgsrc",
      action: "!getcleanimgsrc",
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: "Initiative-Passes",
      action: "!miscinitpasses",
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: "Mass-HP",
      action:
        '!miscmasshp ?{Change HP by - must be an integer or "-" followed by an integer, e.g. -5} ?{HP bar|Bar 1,bar1|Bar 2,bar2|Bar 3,bar3}',
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: "Light-Custom",
      action: `!misclight ?{Distance of bright light - 0 to turn off bright light|0} ?{Distance of dim light - 0 to turn off dim light|0} ?{Angle of light - must be a number between 0 and 360 or "off"|off} ?{Color of light - select "Transparent" for default color${createColorQuery()}}`,
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: "Light-Item",
      action: `!misclight ?{Light source|Turn off,0 0 off|Candle,5 5 off|Dancing Lights (cantrip),0 10 off|Daylight (3rd level spell),60 60 off|Lamp,15 30 off|Lantern (Bullseye),60 60 90|Lantern (Hooded),30 30 off|Light (cantrip),20 20 off|Torch,20 20 off|Wall of Light (5th level spell),120 120 off} ?{Color of light - select "Transparent" for default color${createColorQuery()}}`,
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: "Dancing-Dragon",
      action:
        "!miscdancingdragon ?{Stance to assume|High Stance,High-Stance|Low Stance,Low-Stance|Power Stance,Power-Stance|Off}",
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: "Set-Aura",
      action: `!miscsetaura ?{Aura to update|Aura 1,aura1|Aura 2,aura2} ?{Size of aura - leave blank to turn off} ?{Color of aura${createColorQuery()}} ?{Shape of aura|Circle,false|Square,true} ?{Aura is visible to players|True|False}`,
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: "Set-Daylight",
      action: "!miscsetdaylight ?{Opacity}",
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: "Set-Elevation",
      action:
        "!miscelevation ?{Elevation type|Off|Depth|Height} ?{Elevation amount - must be increments of 5, with a max of 300 for height and 185 for depth} ?{Elevation viewable by|All players|GM}",
      gmOnly: true,
      istokenaction: true,
    },
  ];

  function createColorQuery() {
    const colorKeys = _.keys(HEX_COLORS);

    return _.map(colorKeys, (key) => `|${key},${HEX_COLORS[key]}`);
  }

  function getMacroByName(macroName) {
    return findObjs(
      { _type: "macro", name: macroName },
      { caseInsensitive: true }
    );
  }

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
    const calculateDistance = (distance, defaultDistance) => {
      const parsedDistance = parseFloat(distance);

      return isNaN(parsedDistance) && defaultDistance
        ? defaultDistance
        : parsedDistance;
    };

    let [, brightDistance, dimDistance, lightAngle, lightColor] = _.map(
      message.content.split(" "),
      (lightArg, index) => {
        if (index === 1 || index === 2) {
          return calculateDistance(lightArg, 0);
        } else if (index === 3) {
          return calculateDistance(lightArg);
        }

        return lightArg;
      }
    );

    const tokenLight = {};
    if (brightDistance > 0) {
      tokenLight.emits_bright_light = true;
      tokenLight.bright_light_distance = brightDistance;
    } else {
      tokenLight.emits_bright_light = false;
      tokenLight.has_directional_bright_light = false;
    }

    if (dimDistance > 0) {
      tokenLight.emits_low_light = true;
      tokenLight.low_light_distance = brightDistance + dimDistance;
    } else {
      tokenLight.emits_low_light = false;
      tokenLight.has_directional_dim_light = false;
    }

    if (lightAngle >= 0 && lightAngle <= 360) {
      tokenLight.has_directional_bright_light = brightDistance > 0;
      tokenLight.directional_bright_light_total = lightAngle;
      tokenLight.has_directional_dim_light = dimDistance > 0;
      tokenLight.directional_dim_light_total = lightAngle;
    } else {
      tokenLight.has_directional_bright_light = false;
      tokenLight.has_directional_dim_light = false;
    }

    if (lightColor) {
      tokenLight.lightColor = lightColor;
    }

    _.each(message.selected, (selected) => {
      const token = getObj("graphic", selected._id);

      token.set(tokenLight);
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

  function setAuraScript(message) {
    const [, aura, size, color, isSquare, isVisible] = message.content
      .toLowerCase()
      .split(" ");

    _.each(message.selected, (selected) => {
      const token = getObj("graphic", selected._id);

      token.set({
        [`${aura}_radius`]: size >= 0 ? size : "",
        [`${aura}_color`]: color,
        [`${aura}_square`]: isSquare === "true",
        [`showplayers_${aura}`]: isVisible === "true",
      });
    });
  }

  function setDaylightScript(message) {
    const page = getObj("page", Campaign().get("playerpageid"));

    if (!page.get("dynamic_lighting_enabled")) {
      page.set("dynamic_lighting_enabled", true);
    }

    if (!page.get("daylight_mode_enabled")) {
      page.set("daylight_mode_enabled", true);
    }

    const lightOpacity = parseFloat(message.content.split(" ")[1] || "1");

    page.set("daylightModeOpacity", lightOpacity);
    page.set("force_lighting_refresh", true);
  }

  function setElevationScript(message) {
    const [, elevationType, amount, viewableBy] = message.content.split(" ");

    if (elevationType === "Off" || !amount) {
      _.each(message.selected, (selected) => {
        const token = getObj("graphic", selected._id);
        const tokenMarkers = token.get("statusmarkers").split(/\s*,\s*/g);
        const markersWithoutElevation = _.filter(
          tokenMarkers,
          (marker) => !/^(depth|height)_\d*/i.test(marker)
        );

        token.set("statusmarkers", markersWithoutElevation.join(","));
      });
      return;
    }

    const elevationMarkers = JSON.parse(Campaign().get("token_markers"));
    const gmOnly = viewableBy === "GM";
    const elevationMessage = `has ${
      elevationType === "Height" ? "ascended" : "descended"
    } to ${amount} feet!`;
    let markerToApply = gmOnly
      ? ""
      : _.findWhere(elevationMarkers, {
          name: `${elevationType} ${amount}`,
        });

    if (!markerToApply && !gmOnly) {
      markerToApply = _.findWhere(elevationMarkers, {
        name: `${elevationType} Unknown`,
      });
    }

    _.each(message.selected, (selected) => {
      const token = getObj("graphic", selected._id);
      const tokenMarkers = _.filter(
        token.get("statusmarkers").split(/\s*,\s*/g),
        (marker) => !/^(depth|height)_\d*/i.test(marker)
      );

      if (!gmOnly) {
        tokenMarkers.push(markerToApply.tag);
      }
      token.set("statusmarkers", tokenMarkers.join(","));

      sendChat(
        gmOnly ? MISC_DISPLAY_NAME : "",
        `${gmOnly ? "/w gm" : "/em"} ${token.get("name")} ${elevationMessage}`
      );
    });
  }

  function registerEventHandlers() {
    on("chat:message", (message) => {
      const { content, selected } = message;

      if (message.type === "api") {
        if (/^!misclight/i.test(content) && selected) {
          lightScript(message);
        }

        if (/^!miscdancingdragon/i.test(content) && selected) {
          dancingDragonScript(message);
        }

        if (playerIsGM(message.playerid)) {
          if (/^!getcleanimgsrc/i.test(content) && selected.length) {
            _.each(selected, (selectedItem) => {
              const token = getObj("graphic", selectedItem._id);
              sendChat(MISC_DISPLAY_NAME, `/w gm ${getCleanImgsrc(token)}`);
            });
          }

          if (/^!miscmasshp/i.test(content) && selected.length) {
            massHitpointsScript(message);
          }
          if (/^!miscinitpasses/i.test(content)) {
            initiativePassScript();
          }

          if (/^!miscgetimgsrc/i.test(content) && selected.length) {
            getImgsrcScript(selected);
          }

          if (/^!miscsetaura/i.test(content) && selected.length) {
            setAuraScript(message);
          }

          if (/^!miscsetdaylight/i.test(content)) {
            setDaylightScript(message);
          }

          if (/^!miscelevation/i.test(content)) {
            setElevationScript(message);
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
