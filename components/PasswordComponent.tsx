import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";

interface propsType {
  label: string;
  name: string;
}

export default function PasswordComponent({ label, name }: propsType) {
  const [visible, setvisible] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-center justify-between relative">
        <Field type={!visible ? "password" : "text"} name={name} className="w-full p-2 border rounded" />
        <div className="absolute right-2">
          {visible ? (
            <FaRegEyeSlash
              onClick={() => setvisible(false)}
              className="text-gray-500 cursor-pointer"
              size={20}
            />
          ) : (
            <MdOutlineRemoveRedEye
              onClick={() => setvisible(true)}
              className="text-gray-500 cursor-pointer"
              size={20}
            />
          )}
        </div>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
}
