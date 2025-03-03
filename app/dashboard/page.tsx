"use client";

import { Button, LoadingButton } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { Input } from "@/components/InputComponent";
import { Select, SelectItem } from "@/components/SelectComponent";
import { useState } from "react";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../api/ApiSlice";
import { Project } from "../Types";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, selectUsername } from "../api/AuthSlice";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { persistor } from "../Store";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/TextInput";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

const ProjectSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  partner: Yup.string().required("Partner is required"),
  beneficiary_mmdce: Yup.string().required("Beneficiary MMDCE is required"),
  beneficiary_community: Yup.string().required(
    "Beneficiary Community is required"
  ),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  amount_currency: Yup.string().required("Currency is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
});

export default function Dashboard() {
  const { data, error, isLoading, refetch } = useGetProjectsQuery();
  const username = useSelector(selectUsername);
  const dispatch = useDispatch();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects: Project[] = data?.data || [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(clearAuth());
    persistor?.purge();
    router.push("/");
  };

  const filteredProjects = projects?.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "" || project.status === statusFilter)
  );

  const handleCreateOrUpdateProject = async (project: Partial<Project>) => {
    setLoading(true);
    if (currentProject) {
      await updateProject({
        id: currentProject?.id?.toString(),
        data: project,
      });
    } else {
      await createProject(project);
    }
    setLoading(false);
    setIsModalOpen(false);
    refetch();
  };

  const handleDeleteProject = async () => {
    setLoading(true);
    if (currentProject?.id) {
      await deleteProject(currentProject.id.toString());
    }
    setLoading(false);
    setIsDeleteModalOpen(false);
    refetch();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={50} sx={{ color: "#2B7FFF" }} />
      </div>
    );
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header with Avatar and Logout */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-3xl text-gray-600" />
            <span className="text-lg font-medium">{username}</span>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent>Total: {data?.count}</CardContent>
        </Card>
        <Card>
          <CardContent>
            Completed:{" "}
            {projects?.filter((p) => p.status === "Completed").length}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Pending: {projects?.filter((p) => p.status === "Pending").length}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Ongoing: {projects?.filter((p) => p.status === "Ongoing").length}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Delayed: {projects?.filter((p) => p.status === "Delayed").length}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          onClick={() => {
            setCurrentProject(null);
            setIsModalOpen(true);
          }}
        >
          Create Project
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <SelectItem value="">All</SelectItem>
          <SelectItem value="Not Started">Not Started</SelectItem>
          <SelectItem value="Ongoing">Ongoing</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Delayed">Delayed</SelectItem>
        </Select>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg bg-white rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Partner</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
	      <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr
                key={project.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition duration-200`}
              >
                <td className="border border-[#ddd] p-2">{project.name}</td>
                <td className="border border-[#ddd] p-2">{project.partner}</td>
                <td className="border border-[#ddd] p-2">{project.status}</td>
                <td className="border border-[#ddd] p-2">
                  {project.amount_currency} {project.amount}
                </td>
		<td className="border border-[#ddd] p-2 flex justify-center">
                  <Button
                    className="mr-2"
                    onClick={() => {
                      setCurrentProject(project);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive"                     onClick={() => {
                      setCurrentProject(project);
                      setIsDeleteModalOpen(true);
                    }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <DialogTitle>
          {currentProject ? "Edit Project" : "Create Project"}
        </DialogTitle>
        <Formik
          enableReinitialize
          initialValues={{
            name: currentProject?.name || "",
            partner: currentProject?.partner || "",
            beneficiary_mmdce: currentProject?.beneficiary_mmdce || "",
            beneficiary_community: currentProject?.beneficiary_community || "",
            amount: currentProject?.amount || "",
            amount_currency: currentProject?.amount_currency || "GHS",
            description: currentProject?.description || "",
            status: currentProject?.status || "Not Started",
            stateDate: currentProject?.stateDate || "",
            endDate: currentProject?.endDate || "",
            category: 1,
          }}
          validationSchema={ProjectSchema}
          onSubmit={handleCreateOrUpdateProject}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <div className="space-y-4">
                  <TextInput
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Project Name"
                  />
                  <TextInput
                    label="Partner"
                    name="partner"
                    type="text"
                    placeholder="Partner Name"
                  />
                  <TextInput
                    label="Beneficiary MMDCE"
                    name="beneficiary_mmdce"
                    type="text"
                    placeholder="Beneficiary MMDCE"
                  />
                  <TextInput
                    label="Beneficiary Community"
                    name="beneficiary_community"
                    type="text"
                    placeholder="Beneficiary Community"
                  />
                  <TextInput
                    label="Amount"
                    name="amount"
                    type="number"
                    placeholder="Project Amount"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <Field
                      as="select"
                      name="amount_currency"
                      className="border p-3 rounded-lg w-full"
                    >
                      <option value="GHS">GHS</option>
                      <option value="USD">USD</option>
                    </Field>
                  </div>

                  <TextInput
                    label="Description"
                    name="description"
                    type="text"
                    placeholder="Project Description"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className="border p-3 rounded-lg w-full"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Delayed">Delayed</option>
                    </Field>
                  </div>
                  <TextInput
                    label="Start Date"
                    name="stateDate"
                    type="date"
                    placeholder="Start Date"
                  />
                  <TextInput
                    label="End Date"
                    name="endDate"
                    type="date"
                    placeholder="End Date"
                  />
                </div>
              </DialogContent>

<div className="flex items-end justify-end">

              <DialogActions>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
		<div className="w-[100px]">
                {isSubmitting ? (

                    <LoadingButton />
                ) : (
			<DialogActions>
                    <Button type="submit" disabled={isSubmitting}>
                      {currentProject ? "Update" : "Save"}
                    </Button>
                  </DialogActions>
                )}
		</div>
              </DialogActions>
</div>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Delete Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete {currentProject?.name}?</p>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <div className="w-[100%]">
	
          <Button
            variant="destructive"
            onClick={handleDeleteProject}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
