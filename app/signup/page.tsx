"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRegisterMutation } from "../api/ApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../api/AuthSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import loginImage from "../../asset/loginBG.jpg";
import { AuthType } from "../Types";
import PasswordComponent from "@/components/PasswordComponent";
import LoginSignupLoader from "@/components/LoginSignupLoader";

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    username: "",
    password: "",
    confirm_password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Re-type password"),
  });

  const [error, setError] = useState("");
  const [register, { isLoading, error: loginError, data }] =
    useRegisterMutation();

  const handleSubmit = async (values: {
    username: string;
    password: string;
    confirm_password: string;
  }) => {
    try {
      const result: AuthType = await register(values).unwrap();
      dispatch(
        setCredentials({
          id: result.data.id,
          username: result.data.username,
          token: result.data.token,
        })
      );
      router.push("/dashboard");
    } catch (err:any) {
      setError(err?.data?.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginImage?.src})`,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <Field
                type="text"
                name="username"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
	    <div>
		<PasswordComponent label="Password" name="password" />
	    </div>
	    <div>
		<PasswordComponent label="Confirm Password" name="confirm_password" />
	    </div>
            {isLoading ? (
              <LoginSignupLoader />
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Signup
              </button>
            )}
            <span
              className="flex items-center gap-1.5 text-center justify-center cursor-pointer"
              onClick={() => router.push("/")}
            >
              <p className="font-medium">Already have an account?</p>
              <p className="text-blue-500 font-medium">Login</p>
            </span>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
