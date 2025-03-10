"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import loginImage from "../asset/loginBG.jpg";
import { useLoginMutation } from "./api/ApiSlice";
import { setCredentials } from "./api/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { AuthType } from "./Types";
import PasswordComponent from "@/components/PasswordComponent";
import LoginSignupLoader from "@/components/LoginSignupLoader";
import { RootState } from "./Store";

const Login = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [login, { isLoading, error: loginError, data }] = useLoginMutation();

  const initialValues = { username: "", password: "" };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const result: AuthType = await login(values).unwrap();

      dispatch(
        setCredentials({
          id: result.data.id,
          username: result.data.username,
          token: result.data.token,
        })
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.data?.message || "Login failed. Please try again.");
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
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
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
            {isLoading ? (
              <LoginSignupLoader />
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Login
              </button>
            )}

            <span
              className="flex items-center gap-1.5 text-center justify-center cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              <p className="font-medium">Don't have an account?</p>
              <p className="text-blue-500 font-medium">Sign up</p>
            </span>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
