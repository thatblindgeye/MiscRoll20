const MiscScripts = (function () {
  'use strict';

  const MISC_DISPLAY_NAME = 'Misc Scripts';

  function getCleanImgsrc(selectedTokens) {
    _.each(selectedTokens, (selectedToken) => {
      const token = getObj('graphic', selectedToken._id);
      const name = token.get('name');
      const imgsrc = token.get('imgsrc');
      const parts = imgsrc.match(
        /(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/
      );

      if (parts) {
        const imgURL =
          parts[1] +
          'thumb' +
          parts[3] +
          (parts[4] ? parts[4] : `?${Math.round(Math.random() * 9999999)}`);

        sendChat(
          MISC_DISPLAY_NAME,
          `/w gm <div style="padding: 8px; border: 1px solid gray; border-radius: 25px;"><img src="${imgURL}" alt="${name} token"/><div><code>${imgURL}</code></div></div>`,
          null,
          { noarchive: true }
        );
      } else {
        sendChat(
          MISC_DISPLAY_NAME,
          `/w gm ${name} does not have a valid image source. A token's image cannot be the default image, and the selected token cannot be one that was purchased on the Roll20 marketplace.`,
          null,
          { noarchive: true }
        );
      }
    });
  }

  function getGMPlayers() {
    return _.filter(
      findObjs({
        _type: 'player',
      }),
      (player) => playerIsGM(player.get('_id'))
    );
  }

  const AOE_IMAGES = {
    Air: {
      Cone: 'https://s3.amazonaws.com/files.d20.io/images/320930467/JJwfzOYT3Hviq53stJ8qHg/thumb.png?1672684835',
      Cube: 'https://s3.amazonaws.com/files.d20.io/images/320930469/hV-0-_FpmccQhs16J-WpXQ/thumb.png?1672684836',
      Line: 'https://s3.amazonaws.com/files.d20.io/images/320930471/-dbS-3gqPwSSkjk2yFfxhg/thumb.png?1672684838',
      Sphere:
        'https://s3.amazonaws.com/files.d20.io/images/320930478/19xw4B-AIgFzyIdbAxrRMg/thumb.png?1672684840',
    },
    Earth: {
      Cone: 'https://s3.amazonaws.com/files.d20.io/images/320930517/IdVBKQOCpEeE4NBn7Vl0YA/thumb.png?1672684862',
      Cube: 'https://s3.amazonaws.com/files.d20.io/images/320930526/q5_qstSVNCoPOSBqJ24cIw/thumb.png?1672684865',
      Line: 'https://s3.amazonaws.com/files.d20.io/images/320930530/RR2zSLp0ZKVqmlTO_MZTmA/thumb.png?1672684867',
      Sphere:
        'https://s3.amazonaws.com/files.d20.io/images/320930532/nWw_xyI5lsokgS-C2M0VVg/thumb.png?1672684868',
    },
    Fire: {
      Cone: 'https://s3.amazonaws.com/files.d20.io/images/320930555/_R0KVwaQMxatQuVslHZ7pg/thumb.png?1672684880',
      Cube: 'https://s3.amazonaws.com/files.d20.io/images/320930559/rEA9G8nj8Kro7ijsVlsX1w/thumb.png?1672684881',
      Line: 'https://s3.amazonaws.com/files.d20.io/images/320930562/y_1uT6SjBGt66cn4z7Ewaw/thumb.png?1672684883',
      Sphere:
        'https://s3.amazonaws.com/files.d20.io/images/320930564/P5HDPIEwqb-wHQSmJ7VNVg/thumb.png?1672684884',
    },
    Lightning: {
      Cone: 'https://s3.amazonaws.com/files.d20.io/images/320930570/sVNXfydntYxkRlkPZ0c--A/thumb.png?1672684889',
      Cube: 'https://s3.amazonaws.com/files.d20.io/images/320930577/rUmx45PRB5WgKMkOGHtuSA/thumb.png?1672684891',
      Line: 'https://s3.amazonaws.com/files.d20.io/images/320930581/Hz2HJ_8Z1ZM_hYIPuldUuQ/thumb.png?1672684892',
      Sphere:
        'https://s3.amazonaws.com/files.d20.io/images/320930583/nXt77WZdiMDxHRMBLXuiBg/thumb.png?1672684894',
    },
    Smoke: {
      Cone: 'https://s3.amazonaws.com/files.d20.io/images/320930608/UnktFfbj7aom7bpO040qsw/thumb.png?1672684903',
      Cube: 'https://s3.amazonaws.com/files.d20.io/images/320930612/svh5zig13Jb5uE5hVfPy2Q/thumb.png?1672684904',
      Line: 'https://s3.amazonaws.com/files.d20.io/images/320930616/gWcD5ZMAM7Nj1eeP9dqZgg/thumb.png?1672684906',
      Sphere:
        'https://s3.amazonaws.com/files.d20.io/images/320930627/CfQd2zUALORG49lBCXhphA/thumb.png?1672684908',
    },
    Water: {
      Cone: 'https://s3.amazonaws.com/files.d20.io/images/320930634/1ROH9mxObJfZu_hl7PDmAg/thumb.png?1672684911',
      Cube: 'https://s3.amazonaws.com/files.d20.io/images/320930638/ETwgnqzWR856fhgksaHHZA/thumb.png?1672684913',
      Line: 'https://s3.amazonaws.com/files.d20.io/images/320930639/FVn824sElkJhc13Ahs3m6Q/thumb.png?1672684915',
      Sphere:
        'https://s3.amazonaws.com/files.d20.io/images/320930645/m0UrtEEMgTtnXlmRTJsxeA/thumb.png?1672684916',
    },
  };

  const HEX_COLORS = {
    Transparent: 'transparent',
    Black: '#000000',
    Blue: '#0000ff',
    '--Blue (dark)': '#0000cc',
    '--Blue (darker)': '#000099',
    '--Blue (darkest)': '#000066',
    '--Blue (light)': '#3333ff',
    '--Blue (lighter)': '#6666ff',
    '--Blue (lightest)': '#9999ff',
    Brown: '#a52a2a',
    '--Brown (dark)': '#7e2020',
    '--Brown (darker)': '#551616',
    '--Brown (darkest)': '#2d0c0c',
    '--Brown (light)': '#ce4040',
    '--Brown (lighter)': '#da7171',
    '--Brown (lightest)': '#ebb2b2',
    Cyan: '#00ffff',
    '--Cyan (dark)': '#00cccc',
    '--Cyan (darker)': '#009999',
    '--Cyan (darkest)': '#006666',
    '--Cyan (light)': '#33ffff',
    '--Cyan (lighter)': '#66ffff',
    '--Cyan (lightest)': '#99ffff',
    Gray: '#808080',
    '--Gray (dark)': '#666666',
    '--Gray (darker)': '#4d4d4d',
    '--Gray (darkest)': '#333333',
    '--Gray (light)': '#999999',
    '--Gray (lighter)': '#b3b3b3',
    '--Gray (lightest)': '#cccccc',
    Green: '#008000',
    '--Green (dark)': '#006600',
    '--Green (darker)': '#004d00',
    '--Green (darkest)': '#003300',
    '--Green (light)': '#00cc00',
    '--Green (lighter)': '#33ff33',
    '--Green (lightest)': '#99ff99',
    Magenta: '#ff00ff',
    '--Magenta (dark)': '#cc00cc',
    '--Magenta (darker)': '#990099',
    '--Magenta (darkest)': '#660066',
    '--Magenta (light)': '#ff33ff',
    '--Magenta (lighter)': '#ff66ff',
    '--Magenta (lightest)': '#ff99ff',
    Orange: '#ffa500',
    '--Orange (dark)': '#cc8500',
    '--Orange (darker)': '#996300',
    '--Orange (darkest)': '#664200',
    '--Orange (light)': '#ffb833',
    '--Orange (lighter)': '#ffc966',
    '--Orange (lightest)': '#ffdb99',
    Pink: '#ffc0cb',
    Purple: '#800080',
    Red: '#ff0000',
    '--Red (dark)': '#cc0000',
    '--Red (darker)': '#990000',
    '--Red (darkest)': '#660000',
    '--Red (light)': '#ff3333',
    '--Red (lighter)': '#ff6666',
    '--Red (lightest)': '#ff9999',
    Violet: '#ee82ee',
    '--Violet (dark)': '#e228e2',
    '--Violet (darker)': '#901490',
    '--Violet (darkest)': '#360736',
    '--Violet (light)': '#f3a5f3',
    '--Violet (lighter)': '#f8c9f8',
    '--Violet (lightest)': '#fdedfd',
    White: '#ffffff',
    Yellow: '#ffff00',
    '--Yellow (dark)': '#cccc00',
    '--Yellow (darker)': '#999900',
    '--Yellow (darkest)': '#666600',
    '--Yellow (light)': '#ffff33',
    '--Yellow (lighter)': '#ffff66',
    '--Yellow (lightest)': '#ffff99',
  };

  const MACROS = [
    {
      name: 'Get-Clean-Imgsrc',
      action: '!getcleanimgsrc',
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: 'Initiative-Passes',
      action: '!miscinitpasses',
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: 'Mass-HP',
      action:
        '!miscmasshp ?{Change HP by - must be an integer or "-" followed by an integer, e.g. -5} ?{HP bar|Bar 1,bar1|Bar 2,bar2|Bar 3,bar3}',
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: 'Light-Custom',
      action: `!misclight ?{Distance of bright light - 0 to turn off bright light|0} ?{Distance of dim light - 0 to turn off dim light|0} ?{Angle of light - must be a number between 0 and 360 or "off"|off} ?{Color of light - select "Transparent" for default color${createColorQuery()}}`,
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: 'Light-Item',
      action: `!misclight ?{Light source|Turn off,0 0 off|Candle,5 5 off|Dancing Lights (cantrip),0 10 off|Daylight (3rd level spell),60 60 off|Lamp,15 30 off|Lantern (Bullseye),60 60 90|Lantern (Hooded),30 30 off|Light (cantrip),20 20 off|Torch,20 20 off|Wall of Light (5th level spell),120 120 off} ?{Color of light - select "Transparent" for default color${createColorQuery()}}`,
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: 'Set-Aura',
      action: `!miscsetaura ?{Aura to update|Aura 1,aura1|Aura 2,aura2} ?{Size of aura - leave blank to turn off} ?{Color of aura${createColorQuery()}} ?{Shape of aura|Circle,false|Square,true} ?{Aura is visible to players|True|False}`,
      gmOnly: true,
      istokenaction: true,
    },
    {
      name: 'Set-Daylight',
      action: '!miscsetdaylight ?{Opacity}',
      gmOnly: true,
      istokenaction: false,
    },
    {
      name: 'Set-Elevation',
      action:
        '!miscelevation ?{Elevation type|Off|Depth|Height} ?{Elevation amount - must be increments of 5, with a max of 300 for height and 185 for depth} ?{Elevation viewable by|All players|GM}',
      gmOnly: true,
      istokenaction: true,
    },
    {
      name: 'AOE',
      action:
        '!miscaoe|?{AoE type|Air|Earth|Fire|Lightning|Smoke|Water}|?{AoE shape|Cone|Cube|Line|Sphere}|?{AoE size - must be an integer that is an increment of 5}|?{AoE display name (optional)}',
      gmOnly: false,
      istokenaction: true,
    },
    {
      name: 'Generate-Badge',
      action: '!miscbadge|?{Jurisdiction (e.g. RC for Republic City)}',
      gmOnly: false,
      istokenaction: false,
    },
    {
      name: 'Generate-License-Plate',
      action:
        '!misclicenseplate|?{Vehicle type|Passenger|Multipassenger|Freight|Specialized|Emergency}|?{Nation of Origin|Air Nation,AN|Earth Nation,EN|Fire Nation,FN|Northern Water Tribe,NT|Southern Water Tribe,ST|United Republic,UR}',
      gmOnly: false,
      istokenaction: false,
    },
  ];

  function createColorQuery() {
    const colorKeys = _.keys(HEX_COLORS);

    return _.map(colorKeys, (key) => `|${key},${HEX_COLORS[key]}`);
  }

  function getMacroByName(macroName) {
    return findObjs(
      { _type: 'macro', name: macroName },
      { caseInsensitive: true }
    );
  }

  function createMiscMacros() {
    _.each(MACROS, (macro) => {
      const currentMacro = getMacroByName(macro.name);
      const gmPlayers = _.filter(
        findObjs({
          _type: 'player',
        }),
        (player) => playerIsGM(player.get('_id'))
      );

      if (!currentMacro.length) {
        const { name, action, gmOnly, istokenaction } = macro;

        createObj('macro', {
          _playerid: gmPlayers[0].get('_id'),
          name,
          action,
          visibleto: gmOnly ? _.pluck(gmPlayers, 'id').join(',') : 'all',
          istokenaction,
        });
      }
    });
  }

  function getSelectedObject(selectedToken) {
    const token = getObj('graphic', selectedToken._id);
    const tokenRepresentsId = token.get('represents');

    return { character: getObj('character', tokenRepresentsId), token };
  }

  function getCharacterAttr(characterId, attrToGet) {
    if (typeof attrToGet === 'string') {
      return getAttrByName(characterId, attrToGet);
    }

    return _.map(attrToGet, (attr) => {
      if (typeof attr === 'object') {
        const attrValue = getAttrByName(
          characterId,
          attr.name,
          attr.value || 'current'
        );

        return attr.parseInt ? parseInt(attrValue) : attrValue;
      }

      return getAttrByName(characterId, attr);
    });
  }

  function initiativePassScript() {
    const currentTurnorder =
      Campaign().get('turnorder') === ''
        ? []
        : JSON.parse(Campaign().get('turnorder'));

    const initiativePasses = [];

    _.each(currentTurnorder, (turnorderItem) => {
      let currentInit = parseInt(turnorderItem.pr);

      while (currentInit > 0) {
        initiativePasses.push({ ...turnorderItem, pr: currentInit });
        currentInit -= 10;
      }
    });

    Campaign().set('turnorder', JSON.stringify(initiativePasses));
  }

  function massHitpointsScript(content, selectedTokens) {
    let [, hpChange, tokenBar] = content.split(' ');
    hpChange = parseInt(hpChange);

    _.each(selectedTokens, (selectedToken) => {
      const { character, token } = getSelectedObject(selectedToken);
      if (!character) {
        const bar1Value = parseInt(token.get('bar1_value'));
        token.set({ bar1_value: bar1Value + hpChange });
        BarThresholds.runThresholds(tokenBar, selectedToken, bar1Value);
      } else {
        const [currentHP, maxHP, maxReducedHP, tempHP] = getCharacterAttr(
          character.id,
          [
            { name: 'hp', parseInt: true },
            { name: 'hp', parseInt: true, value: 'max' },
            { name: 'hp_max_reduced', parseInt: true },
            { name: 'temp_hp', parseInt: true },
          ]
        );

        if (hpChange > 0) {
          const trueMaxHP = maxHP - (maxReducedHP || 0);
          const newHP = currentHP + hpChange;
          setAttrs(character.id, {
            hp: newHP > trueMaxHP ? trueMaxHP : newHP,
          });
        }

        if (hpChange < 0) {
          setAttrs(character.id, {
            hp:
              hpChange + tempHP < 0 ? currentHP + hpChange + tempHP : currentHP,
            temp_hp: hpChange + tempHP > 0 ? tempHP + hpChange : 0,
          });
        }

        BarThresholds.runThresholds(tokenBar, selectedToken, currentHP);
      }
    });
  }

  function lightScript(content, selectedTokens) {
    const calculateDistance = (distance, defaultDistance) => {
      const parsedDistance = parseFloat(distance);

      return isNaN(parsedDistance) && defaultDistance
        ? defaultDistance
        : parsedDistance;
    };

    let [, brightDistance, dimDistance, lightAngle, lightColor] = _.map(
      content.split(' '),
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

    _.each(selectedTokens, (selectedToken) => {
      const token = getObj('graphic', selectedToken._id);

      token.set(tokenLight);
    });
  }

  function dancingDragonScript(content, selectedTokens) {
    const stance = content.split(' ')[1].replace('-', ' ');
    const token = getObj('graphic', selectedTokens[0]._id);

    if (token.get('tooltip').includes(stance)) {
      sendChat('', `/em ${token.get('name')} remains in the ${stance}!`);
      return;
    }

    ConditionTracker.updateConditionInstances(
      'remove',
      'high stance, power stance, low stance',
      [token]
    );

    if (stance.toLowerCase() !== 'off') {
      ConditionTracker.updateConditionInstances('add', stance, [token]);
      sendChat('', `/em ${token.get('name')} takes the ${stance}!`);
    } else {
      sendChat('', `/em ${token.get('name')} has exited the Dancing Dragon!`);
    }
  }

  function setAuraScript(content, selectedTokens) {
    const [, aura, size, color, isSquare, isVisible] = content
      .toLowerCase()
      .split(' ');

    _.each(selectedTokens, (selectedToken) => {
      const token = getObj('graphic', selectedToken._id);

      token.set({
        [`${aura}_radius`]: size >= 0 ? size : '',
        [`${aura}_color`]: color,
        [`${aura}_square`]: isSquare === 'true',
        [`showplayers_${aura}`]: isVisible === 'true',
      });
    });
  }

  function setDaylightScript(content) {
    const page = getObj('page', Campaign().get('playerpageid'));

    if (!page.get('dynamic_lighting_enabled')) {
      page.set('dynamic_lighting_enabled', true);
    }

    if (!page.get('daylight_mode_enabled')) {
      page.set('daylight_mode_enabled', true);
    }

    const lightOpacity = parseFloat(content.split(' ')[1] || '1');

    page.set('daylightModeOpacity', lightOpacity);
    page.set('force_lighting_refresh', true);
  }

  function setElevationScript(content, selectedTokens) {
    const [, elevationType, amount, viewableBy] = content.split(' ');

    if (/off/i.test(elevationType) || !amount) {
      _.each(selectedTokens, (selectedToken) => {
        const token = getObj('graphic', selectedToken._id);
        const tokenMarkers = token.get('statusmarkers').split(/\s*,\s*/g);
        const markersWithoutElevation = _.filter(
          tokenMarkers,
          (marker) => !/^(depth|height)_\d*/i.test(marker)
        );

        token.set('statusmarkers', markersWithoutElevation.join(','));
      });
      return;
    }

    const elevationMarkers = JSON.parse(Campaign().get('token_markers'));
    const gmOnly = viewableBy === 'GM';
    const elevationMessage = `has ${
      elevationType === 'Height' ? 'ascended' : 'descended'
    } to ${amount} feet!`;
    let markerToApply = gmOnly
      ? ''
      : _.findWhere(elevationMarkers, {
          name: `${elevationType} ${amount}`,
        });

    if (!markerToApply && !gmOnly) {
      markerToApply = _.findWhere(elevationMarkers, {
        name: `${elevationType} Unknown`,
      });
    }

    _.each(selectedTokens, (selectedToken) => {
      const token = getObj('graphic', selectedToken._id);
      const tokenMarkers = _.filter(
        token.get('statusmarkers').split(/\s*,\s*/g),
        (marker) => !/^(depth|height)_\d*/i.test(marker)
      );

      if (!gmOnly) {
        tokenMarkers.push(markerToApply.tag);
      }
      token.set('statusmarkers', tokenMarkers.join(','));

      sendChat(
        gmOnly ? MISC_DISPLAY_NAME : '',
        `${gmOnly ? '/w gm' : '/em'} ${token.get('name')} ${elevationMessage}`
      );
    });
  }

  function createAOEScript(content, selectedTokens) {
    const [, aoeType, aoeShape, aoeSize, aoeName] = content.split('|');
    const parsedSize = parseInt(aoeSize);

    if (parsedSize % 5 !== 0 || !parsedSize) {
      throw new Error(
        `<code>${aoeSize}</code> is not a valid size for an AOE. The size entered must be an integer greater than 0 and be an increment of 5.`
      );
    }

    const sizeMultiplier = /^sphere$/i.test(aoeShape)
      ? (parsedSize / 5) * 2
      : parsedSize / 5;

    _.each(selectedTokens, (selectedToken) => {
      const { character, token } = getSelectedObject(selectedToken);
      const characterControl = character.get('controlledby');

      const aoe = createObj('graphic', {
        _pageid: getObj('page', token.get('pageid')).get('id'),
        imgsrc: AOE_IMAGES[aoeType][aoeShape],
        name: aoeName || `${token.get('name')} ${aoeType}`,
        showplayers_name: true,
        top: token.get('top'),
        left: token.get('left'),
        width: 70 * sizeMultiplier,
        height: /^line$/i.test(aoeShape) ? 70 : 70 * sizeMultiplier,
        layer: 'objects',
        showname: true,
        controlledby:
          characterControl || _.pluck(getGMPlayers(), 'id').join(','),
      });
    });
  }

  function getRandom(maxNumber, minNumber = 1, padStart = true) {
    const randomNumber = Math.floor(Math.random() * maxNumber) + minNumber;
    if (padStart) {
      const maxLength = maxNumber.toString().length;

      return randomNumber.toString().padStart(maxLength, '0');
    }

    return randomNumber;
  }

  function generateBadgeScript(content) {
    const [, jurisdiction] = content.toUpperCase().split('|');

    const badgePrefix = getRandom(99999);
    const badgeSuffix = getRandom(999);

    sendChat(
      MISC_DISPLAY_NAME,
      `/w gm ${badgePrefix} ${jurisdiction} ${badgeSuffix}`,
      null,
      {
        noarchive: true,
      }
    );
  }

  const licensePlateBase = {
    passenger: 69,
    multipassenger: 10,
    freight: 10,
    specialized: 5,
    emergency: 5,
  };

  const licensePlateMinimum = {
    passenger: 0,
    multipassenger: 69,
    freight: 79,
    specialized: 89,
    emergency: 94,
  };

  function generateLicensePlateScript(content) {
    const [, vehicleType, nation] = content.toLowerCase().split('|');
    const platePrefix = getRandom(
      licensePlateBase[vehicleType],
      licensePlateMinimum[vehicleType]
    );

    const plateSuffix = getRandom(9999);

    sendChat(
      MISC_DISPLAY_NAME,
      `/w gm ${platePrefix} ${nation.toUpperCase()} ${plateSuffix}`,
      null,
      { noarchive: true }
    );
  }

  function handleChatInput(message) {
    try {
      const { content, selected, type } = message;

      if (type !== 'api') {
        return;
      }

      const areTokensSelected = selected && selected.length;
      if (/^!misclight/i.test(content) && areTokensSelected) {
        lightScript(content, selected);
      }

      if (/^!miscdancingdragon/i.test(content) && areTokensSelected) {
        dancingDragonScript(content, selected);
      }

      if (/^!miscaoe/i.test(content) && areTokensSelected) {
        createAOEScript(content, selected);
      }

      if (playerIsGM(message.playerid)) {
        if (/^!getcleanimgsrc/i.test(content) && areTokensSelected) {
          getCleanImgsrc(selected);
        }

        if (/^!miscmasshp/i.test(content) && areTokensSelected) {
          massHitpointsScript(content, selected);
        }
        if (/^!miscinitpasses/i.test(content)) {
          initiativePassScript();
        }

        if (/^!miscsetaura/i.test(content) && areTokensSelected) {
          setAuraScript(content, selected);
        }

        if (/^!miscsetdaylight/i.test(content)) {
          setDaylightScript(content);
        }

        if (/^!miscelevation/i.test(content) && areTokensSelected) {
          setElevationScript(content, selected);
        }

        if (/^!miscbadge/i.test(content)) {
          generateBadgeScript(content);
        }

        if (/^!misclicenseplate/i.test(content)) {
          generateLicensePlateScript(content);
        }
      }
    } catch (error) {
      sendChat(
        MISC_DISPLAY_NAME,
        `/w "${message.who.replace(' (GM)', '')}" ${error.message}`,
        null,
        { noarchive: true }
      );
    }
  }

  function registerEventHandlers() {
    on('chat:message', handleChatInput);
  }

  return {
    createMiscMacros,
    registerEventHandlers,
    getCharacterAttr,
  };
})();

on('ready', () => {
  'use strict';

  MiscScripts.createMiscMacros();
  MiscScripts.registerEventHandlers();
});
