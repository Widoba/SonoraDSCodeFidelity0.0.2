import React from "react";
import { colors } from "@/lib/design-tokens";

interface ColorSwatchProps {
  color: string;
  name: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name }) => {
  return (
    <div className="flex flex-col">
      <div
        className="w-10 h-10"
        style={{ backgroundColor: color }}
        title={name}
      />
      <span className="text-xs mt-1 text-gray-600 hidden group-hover:block">
        {name}
      </span>
    </div>
  );
};

const ColorPalette: React.FC = () => {
  return (
    <section aria-labelledby="color-palette-heading">
      <h2 id="color-palette-heading" className="text-lg font-semibold mb-4">
        Color Palette
      </h2>
      <div className="flex flex-col w-10 group">
        <ColorSwatch color={getColorValue('white')} name="White" />
        <ColorSwatch color={getColorValue('charcoal')} name="Charcoal" />
        <ColorSwatch color={getColorValue('olivia-blue')} name="Olivia Blue" />
        <ColorSwatch
          color={getColorValue('olivia-blue-darker')}
          name="Olivia Blue Darker"
        />
        <ColorSwatch color={getColorValue('olivia-blue-t600')} name="Olivia Blue T600" />
        <ColorSwatch color={getColorValue('olivia-blue-t700')} name="Olivia Blue T700" />
        <ColorSwatch color={getColorValue('olivia-blue-t900')} name="Olivia Blue T900" />
        <ColorSwatch color={getColorValue('olivia-blue-t950')} name="Olivia Blue T950" />
        <ColorSwatch color={getColorValue('olivia-blue-t950')} name="Olivia Blue T950-2" />
        <ColorSwatch color={getColorValue('midnight-teal')} name="Midnight Teal" />
        <ColorSwatch color={getColorValue('earl-grey')} name="Earl Grey" />
        <ColorSwatch color={getColorValue('steel-grey')} name="Steel Grey" />
        <ColorSwatch color={getColorValue('glitter-grey')} name="Glitter Grey" />
        <ColorSwatch color={getColorValue('disco-grey')} name="Disco Grey" />
        <ColorSwatch color={getColorValue('fog-grey')} name="Fog Grey" />
        <ColorSwatch color={getColorValue('mist-grey')} name="Mist Grey" />
        <ColorSwatch color={getColorValue('danger-red')} name="Danger Red" />
        <ColorSwatch color={getColorValue('danger-red-dark')} name="Danger Red Dark" />
        <ColorSwatch color={getColorValue('danger-red-t300')} name="Danger Red T300" />
        <ColorSwatch color={getColorValue('danger-red-t900')} name="Danger Red T900" />
        <ColorSwatch color={getColorValue('caution-yellow')} name="Caution Yellow" />
        <ColorSwatch
          color={getColorValue('caution-yellow-dark')}
          name="Caution Yellow Dark"
        />
        <ColorSwatch
          color={getColorValue('caution-yellow-t300')}
          name="Caution Yellow T300"
        />
        <ColorSwatch
          color={getColorValue('caution-yellow-t900')}
          name="Caution Yellow T900"
        />
        <ColorSwatch color={getColorValue('go-green')} name="Go Green" />
        <ColorSwatch color={getColorValue('go-green-dark')} name="Go Green Dark" />
        <ColorSwatch color={getColorValue('go-green-t600')} name="Go Green T600" />
        <ColorSwatch color={getColorValue('go-green-t900')} name="Go Green T900" />
        <ColorSwatch color={getColorValue('cardinal-red')} name="Cardinal Red" />
        <ColorSwatch color={getColorValue('navy-blue')} name="Navy Blue" />
        <ColorSwatch color={getColorValue('cactus-green')} name="Cactus Green" />
        <ColorSwatch color={getColorValue('cactus-green-dark')} name="Cactus Green Dark" />
        <ColorSwatch color={getColorValue('cactus-green-t400')} name="Cactus Green T400" />
        <ColorSwatch color={getColorValue('cactus-green-t800')} name="Cactus Green T800" />
        <ColorSwatch color={getColorValue('sky-blue')} name="Sky Blue" />
        <ColorSwatch color={getColorValue('sky-blue-dark')} name="Sky Blue Dark" />
        <ColorSwatch color={getColorValue('sky-blue-t600')} name="Sky Blue T600" />
        <ColorSwatch color={getColorValue('sky-blue-t800')} name="Sky Blue T800" />
        <ColorSwatch color={getColorValue('twilight-purple')} name="Twilight Purple" />
        <ColorSwatch
          color={getColorValue('twilight-purple-dark')}
          name="Twilight Purple Dark"
        />
        <ColorSwatch
          color={getColorValue('twilight-purple-t400')}
          name="Twilight Purple T400"
        />
        <ColorSwatch
          color={getColorValue('twilight-purple-t800')}
          name="Twilight Purple T800"
        />
        <ColorSwatch
          color={getColorValue('prickly-pear-magenta')}
          name="Prickly Pear Magenta"
        />
        <ColorSwatch
          color={getColorValue('prickly-pear-magenta-dark')}
          name="Prickly Pear Magenta Dark"
        />
        <ColorSwatch
          color={getColorValue('prickly-pear-magenta-t400')}
          name="Prickly Pear Magenta T400"
        />
        <ColorSwatch
          color={getColorValue('prickly-pear-magenta-t800')}
          name="Prickly Pear Magenta T800"
        />
        <ColorSwatch color={getColorValue('desert-red')} name="Desert Red" />
        <ColorSwatch color={getColorValue('desert-red-dark')} name="Desert Red Dark" />
        <ColorSwatch color={getColorValue('desert-red-t400')} name="Desert Red T400" />
        <ColorSwatch color={getColorValue('desert-red-t800')} name="Desert Red T800" />
        <ColorSwatch color={getColorValue('dune-orange')} name="Dune Orange" />
        <ColorSwatch color={getColorValue('dune-orange-dark')} name="Dune Orange Dark" />
        <ColorSwatch color={getColorValue('dune-orange-t400')} name="Dune Orange T400" />
        <ColorSwatch color={getColorValue('dune-orange-t800')} name="Dune Orange T800" />
      </div>
    </section>
  );
};

export default ColorPalette;
