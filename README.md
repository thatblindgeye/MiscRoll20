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

`!miscLight [bright light] [dim light] [light direction] [light color]`

Causes the selected tokens to emit light with the specified distances, direction, and color.

Both the `bright light` and `dim light` arguments must be a number. If 0 is passed as the distance, that level of light will be turned off for the tokens.

The `light direction` must be either a number between 0 and 360, or `off`. Passing in a value to this argument can create cones of light, such as from a bullseye lantern.

The `light color` argument is optional, but must be a 6 character HEX color, e.g. `#ff0000`, or `transparent` when passed in.

Two macros are created for this script, the "Light-Custom" and "Light-Item" macros. "Light-Custom" allows passing in your own custom values to each argument, while "Light-Item" offers a dropdown of various light sources that can be selected.

### Dancing dragon

`!miscDancingDragon [stance]`

Requires the ConditionTracker script to be installed. Sets the selected token to the specified stance of a homebrew feat called The Dancing Dragon.

### Set aura

`!miscSetAura [Aura to update] [Aura size] [Aura color] [Is square] [Visible to players]`

Sets the aura for the selected tokens.

The `aura to update` argument must be either `aura1` or `aura2`.

The `aura size` must be an integer or decimal greater than 0. Passing in a value of 0 (or a blank value) will turn the specified aura off.

The `aura color` argument must be a 6 character HEX value or `transparent`.

The `is square` argument must be either `true` or `false`.

The `visible to players` argument must be either `true` or `false`, and determines whether players can see the aura.

### Set daylight

`!miscSetDaylight [opacity]`

Sets the daylight opacity for the page that players are currently on. This must be the page with the "Players" banner.

If dynamic lighting and/or daylight mode are not enabled for the page, this command will turn both on.

The `opacity` argument must be 0 to turn daylight off, 1 for maximum daylight brightness, or a decimal between 0 and 1 for varying levels of daylight.
