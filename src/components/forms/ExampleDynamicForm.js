import React, { useState } from "react";
import DynamicTable from "./DynamicTable";

// Helper to generate unique IDs
const generateId = (() => {
  let id = 1;
  return () => id++;
})();

const schema = [
  {
    type: "input",
    name: "title",
    label: "Title",
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  {
    type: "input",
    name: "description",
    label: "Description",
    minLength: 5,
    maxLength: 100,
  },
  {
    type: "textarea",
    name: "textarea",
    label: "Textarea",
    required: true,
    minLength: 10,
    maxLength: 200,
  },
  {
    type: "select",
    name: "select",
    label: "Select",
    required: true,
    options: [
      { value: "", label: "Select..." },
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  },
  {
    type: "checkbox",
    name: "checkbox",
    label: "Checkbox",
    required: true,
  },
  {
    type: "radio",
    name: "radio",
    label: "Radio",
    required: true,
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  },
  {
    type: "date",
    name: "date",
    label: "Date",
    required: true,
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    required: true,
    minLength: 6,
    maxLength: 20,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    required: true,
    pattern: "^\\S+@\\S+\\.\\S+$",
  },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "email", label: "Email" },
  { key: "select", label: "Select" },
  { key: "date", label: "Date" }
];

const ExampleDynamicForm = () => {
  const [data, setData] = useState([
    {
      id: generateId(),
      title: "Example 1",
      description: "Description 1",
      textarea: "Some text here...",
      select: "option1",
      checkbox: true,
      radio: "option2",
      date: "2024-06-01",
      password: "password1",
      email: "example1@email.com",
    },
    {
      id: generateId(),
      title: "Example 2",
      description: "Description 2",
      textarea: "Another text here...",
      select: "option2",
      checkbox: false,
      radio: "option1",
      date: "2024-06-02",
      password: "password2",
      email: "example2@email.com",
    },
    {
      id: generateId(),
      title: "Example 3",
      description: "Description 3",
      textarea: "Another text here...",
      select: "option3",
      checkbox: false,
      radio: "option1",
      date: "2024-06-02",
      password: "password3",
      email: "example3@email.com",
    },
    
  ]);

  const handleFormSubmit = async (row, mode, idx) => {
    try {
      if (mode === "add") {
        setData(prev => [...prev, { ...row, id: generateId() }]);
      } else if (mode === "edit" && idx != null) {
        setData(prev => prev.map((item, i) => (i === idx ? { ...item, ...row } : item)));
      }
      return true;
    } catch (err) {
      throw new Error("Failed to save data. Please try again.");
    }
  };

  return (
    <div className="container mt-4"> 
      <DynamicTable
        columns={columns}
        data={data}
        formSchema={schema}
        onFormSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ExampleDynamicForm; 