"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRegisterMutation } from "../api/ApiSlice";
import { useDispatch } from "react-redux";
import { setToken } from "../api/AuthSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import loginImage from "../../asset/loginBG.jpg";
import { LoadingButton } from "@/components/Button";
import { AuthType } from "../Types";

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });

  const [error, setError] = useState("");
  const [register, { isLoading, error: loginError, data }] =
    useRegisterMutation();

  const handleSubmit = async (values: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const result: AuthType = await register(values).unwrap();
      router.push("/dashboard");
      dispatch(setToken(result?.data?.token));
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
              <label className="block text-sm font-medium">First Name</label>
              <Field
                type="text"
                name="firstName"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <Field
                type="text"
                name="lastName"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            {isLoading ? (
              <LoadingButton />
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
