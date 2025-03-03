import { useField } from "formik";

interface TextInputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}

export const TextInput = ({ label, ...props }: TextInputProps) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...field}
        {...props}
        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};
