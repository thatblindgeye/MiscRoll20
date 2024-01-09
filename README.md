# Misc Roll20 Scripts

This is a collection of miscellaneous scripts for Roll20 that don't require any state.

## List of scripts

The following list details what each script is meant for. When calling the command with the specified syntax, lettercase generally is not important.

### Get clean image source

`!miscGetCleanImgsrc`

Retrieves a "clean" image URL from a token to be used by the API. See [get clean image source](https://wiki.roll20.net/API:Cookbook#getCleanImgsrc) documentation for more information.

### Initiative passes

`!miscInitPasses`

Takes the current items in the Roll20 turnorder and creates initiative passes, based on the initiative system in Shadowrun.

Each item's initiative is reduced by 10, and if the initiative is greater than 0 another turn is added to the turnorder with that reduced initiative.

For example, given the following turnorder:

- Player 1 (28)
- Player 2 (19)
- Player 3 (5)

Calling the initiative passes command would cause the turnorder to end up as the following:

- Player 1 (28)
- Player 2 (19)
- Player 1 (18)
- Player 2 (9)
- Player 1 (8)
- Player 3 (5)

### Mass HP

`!miscMassHP [Change amount] [Token bar]`

Allows adjusting multiple token HP bars at once.

The `change amount` argument must be an integer greater than or less than 0, e.g. `5` or `-5`. This will be added to the selected tokens HP.

The `token bar` argument must be one of either `bar1`, `bar2`, or `bar3`.

The macro that is created with this script creates a dropdown roll query for selecting the token bar. You can edit this macro to remove the query and hardcode the token bar in if you don't expect to ever need to mass adjust another token bar.

### Light

`!miscLight [bright light] [dim light] [light angle] [light color]`

Causes the selected tokens to emit light with the specified distances, direction, and color.

Both the `bright light` and `dim light` arguments must be a number. If 0 is passed as the distance, that level of light will be turned off for the tokens.

The `light angle` must be either a number between 0 and 360, or `off`. Passing in a value to this argument changes the angle of the light that is emitted. For example, 360 would cause light to emit 360 degrees from the token (the default for light), while 90 would create a cone of light.

The `light color` argument is optional, but must be a 6 character HEX color, e.g. `#ff0000`, or `transparent` when passed in.

Two macros are created for this script, the "Light-Custom" and "Light-Item" macros. "Light-Custom" allows passing in your own custom values to each argument, while "Light-Item" offers a dropdown of various light sources that can be selected.

### Dancing dragon

`!miscDancingDragon [stance]`

Requires the ConditionTracker script to be installed. Sets the selected token to the specified stance of a homebrew feat called The Dancing Dragon.

### Set aura

`!miscSetAura [Aura to update] [Aura size] [Aura color] [Is square] [Visible to players]`

Sets the aura for the selected tokens.

The `aura to update` argument must be either `aura1` or `aura2`.

The `aura size` must be an integer or decimal greater than or equal to 0. Passing in a blank value will turn the aura off.

The `aura color` argument must be a 6 character HEX value or `transparent`.

The `is square` argument must be either `true` or `false`.

The `visible to players` argument must be either `true` or `false`, and determines whether players can see the aura.

### Set daylight

`!miscSetDaylight [opacity]`

Sets the daylight opacity for the page that players are currently on. This must be the page with the "Players" banner.

If dynamic lighting and/or daylight mode are not enabled for the page, this command will turn both on.

The `opacity` argument must be 0 to turn daylight off, 1 for maximum daylight brightness, or a decimal between 0 and 1 for varying levels of daylight.

### AOE

`!miscAoe|[aoeType]|[aoeShape]|[aoeSize]|[aoeName]`

Creates an AOE token. At least one token must be selected when calling this command.

`aoeType` refers to the type of the AOE, such as whether it is comprised of smoke, water, fire, and so on. This must be either `air`, `earth`, `fire`, `lightning`, `smoke`, or `water`.

`aoeShape` refers to one of the typical AOE shapes, and must be either `cone`, `cube`, `line`, or `sphere`.

`aoeSize` must be an integer greater than 0 and must be an increment of 5. If `sphere` is selected as the `aoeShape` the size will refer to the radius, e.g. passing in `10` would create a 10 foot radius sphere. If `line` is selected as the `aoeShape` the size will refer to the width only as the height will default to 5 feet.

`aoeName` is optional, and will create a nameplate for the AOE token. If this is not passed in, the AOE token nameplate will default to the name of the selected token + the `aoeType`.

### Generate badge

`!miscbadge|[jurisdiction]`

Generates a badge number for emergency/law personnel. The `jurisidction` argument should be a string of the relevant town/city, region, or nation. For example, `RC` would be the jurisdiction for Republic City.

### Generate license plate

`!misclicenseplate|[vehicle type]|[nation of origin]`

Generates a license plate for the specified vehicle type and nation.

The `vehicle type` argument must be one of the following (case sensitive):

- `passenger`
- `multipassenger`
- `freight`
- `specialized`
- `emergency`

### Get character attributes

`MiscScripts.getCharacterAttr(characterId, attrToGet)`

Calls Roll20's `getAttrByName` method internally.

`characterId` must be the `id` property of a character object.

`attrToGet` can be either a string or an array. When a string is passed in, the attribute's `current` value will be returned.

An array can contain either strings or objects in any combination. A string array item will return the attribute's `current` value. An object can contain the following properties:

- `name` - string (**required**): The name of the attribute.
- `parseInt` - boolean: Whether the retrieved value should be passed into the `parseInt` method before being returned.
- `value` "current" | "max": the value type to be returned. By default the "current" value will be returned.

Some examples of valid calls with the helper:

- `MiscScripts.getCharacterAttr("hp")`
- `MiscScripts.getCharacterAttr(["hp", "temp_hp"])`
- `MiscScripts.getCharacterAttr([{name: "hp", parseInt: true, value: "max"}, "temp_hp"])`
