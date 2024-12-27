import React from 'react';
import { ChromePicker } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg" onClick={e => e.stopPropagation()}>
        <ChromePicker
          color={color}
          onChange={(color) => onChange(color.hex)}
          disableAlpha
        />
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;