"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";
import { Button, LoadingButton } from "@/components/Button";
import { Project } from "@/app/Types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextInput } from "./TextInput";

interface ProjectModalProps {
  project: Partial<Project> | null;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  isLoading: boolean;
}

const ProjectSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  partner: Yup.string().required("Partner is required"),
  beneficiary_mmdce: Yup.string().required("Beneficiary MMDCE is required"),
  beneficiary_community: Yup.string().required("Beneficiary Community is required"),
  amount: Yup.number().required("Amount is required").positive("Amount must be positive"),
  amount_currency: Yup.string().required("Currency is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
});




export default function ProjectModal({ project, onClose, onSave, isLoading }: ProjectModalProps) {
  const [initialValues, setInitialValues] = useState<Partial<Project>>({
    name: "",
    partner: "",
    beneficiary_mmdce: "",
    beneficiary_community: "",
    amount: "",
    amount_currency: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    if (project) {
      setInitialValues({
        name: project.name || "",
        partner: project.partner || "",
        beneficiary_mmdce: project.beneficiary_mmdce || "",
        beneficiary_community: project.beneficiary_community || "",
        amount: project.amount || "",
        amount_currency: project.amount_currency || "",
        description: project.description || "",
        status: project.status || "",
      });
    }
  }, [project]);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ProjectSchema}
        onSubmit={onSave}
      >
          <Form>
            <DialogContent>
              <div className="space-y-4">
                <TextInput label="Name" name="name" type="text" placeholder="Name" />
                <TextInput label="Partner" name="partner" type="text" placeholder="Partner" />
                <TextInput label="Beneficiary MMDCE" name="beneficiary_mmdce" type="text" placeholder="Beneficiary MMDCE" />
                <TextInput label="Beneficiary Community" name="beneficiary_community" type="text" placeholder="Beneficiary Community" />
                <TextInput label="Amount" name="amount" type="number" placeholder="Amount" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <Field
                    as="select"
                    name="amount_currency"
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  >
                    <option value="GHS">GHS</option>
                    <option value="USD">USD</option>
                  </Field>
                </div>
                <TextInput label="Description" name="description" type="text" placeholder="Description" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Delayed">Delayed</option>
                  </Field>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button type="submit">Save</Button>
              )}
            </DialogActions>
          </Form>
      </Formik>
    </Dialog>
  );
}