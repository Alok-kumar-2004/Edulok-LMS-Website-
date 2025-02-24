import * as Select from "@radix-ui/react-select";
import { Label } from "@radix-ui/react-label";
import { ChevronDownIcon } from "@radix-ui/react-icons";

// eslint-disable-next-line react/prop-types
function FormControls( {formControls = [], formData, setFormData }) {
  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border px-3 py-2 rounded-md w-full"
          />
        );
        break;

      case "select":
        element = (
          // <Select.Root
          //   value={currentControlItemValue}
          //   onValueChange={(value) =>
          //     setFormData({
          //       ...formData,
          //       [getControlItem.name]: value,
          //     })
          //   }
          // >
          //   <Select.Trigger className="border px-3 py-2 rounded-md w-full flex justify-between items-center">
          //     <Select.Value placeholder={ String (getControlItem.label)} />
          //     <ChevronDownIcon />
          //   </Select.Trigger>
          //   <Select.Content className="border rounded-md shadow-lg bg-white">
          //     <Select.Viewport>
          //       { getControlItem.options && getControlItem.options.length > 0
          //       ? getControlItem.options.map((optionItem) => (
          //         <Select.Item
          //           key={optionItem.id}
          //           value={optionItem.id}
          //           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          //         >
          //           {optionItem.label}
          //         </Select.Item>
          //       )): null }
          //     </Select.Viewport>
          //   </Select.Content>
          // </Select.Root>
          <Select.Root
      value={currentControlItemValue}
      onValueChange={(value) =>
        setFormData({
          ...formData,
          [getControlItem.name]: value,
        })
      }
    >
      <Select.Trigger className="border px-3 py-2 rounded-md w-full flex justify-between items-center">
        <Select.Value placeholder={String(getControlItem.label)} />
        <Select.Icon className="ml-2">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="border rounded-md shadow-lg bg-white">
          <Select.ScrollUpButton className="py-1 bg-gray-200 text-gray-600">
            ▲
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1">
            {getControlItem.options && getControlItem.options.length > 0
              ? getControlItem.options.map((optionItem) => (
                  <Select.Item
                    key={optionItem.id}
                    value={optionItem.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer focus:bg-gray-200"
                  >
                    <Select.ItemText>{optionItem.label}</Select.ItemText>
                  </Select.Item>
                ))
              : null}
          </Select.Viewport>
          <Select.ScrollDownButton className="py-1 bg-gray-200 text-gray-600">
            ▼
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
        );
        break;

        case "textarea":
          element = (
            <textarea
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              value={currentControlItemValue}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className="border px-3 py-2 rounded-md w-full resize-none"
            />
          );
          break;

      default:
        element = (
          <input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border px-3 py-2 rounded-md w-full"
          />
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-3 ">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}>
          <label htmlFor={controlItem.name}>{controlItem.label}</label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  );
}

export default FormControls;
