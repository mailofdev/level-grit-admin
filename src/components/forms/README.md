# Forms Components

This folder contains reusable, highly-configurable form and table components for dynamic CRUD UIs in React.

## Components

### 1. DynamicForm
- Renders a form based on a schema array.
- Supports all common field types: input, textarea, select, checkbox, radio, date, password, email.
- Built-in validation: required, min/max length, pattern, email, custom, and cross-field.
- Error summary and field-level errors with accessibility support.
- Loading state on submit.
- Cancel button (if `onCancel` provided).
- All fields are disabled in view mode.
- Responsive, Bootstrap-styled UI.

#### Usage Example
```jsx
import DynamicForm from './DynamicForm';

const schema = [
  { type: 'input', name: 'title', label: 'Title', required: true },
  { type: 'email', name: 'email', label: 'Email', required: true },
  // ...other fields
];

<DynamicForm
  schema={schema}
  mode="edit" // or "view"
  formData={formData}
  onChange={setFormData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

---

### 2. DynamicTable
- Displays tabular data with:
  - **Row selection** (radio/checkbox)
  - **Row highlighting**: selected row = gold, alternates = pink/yellow
  - **Search** (filters all columns)
  - **Pagination** (default 5 rows/page)
  - **Total records** display
  - **Horizontal scrolling** for overflow
  - **CRUD toolbar**: Add, Edit, View, Delete (with icons)
  - **Toasts** for success/error feedback
- Integrates with DynamicForm for add/edit/view.
- Fully responsive and Bootstrap-styled.
- Uses [react-icons](https://react-icons.github.io/react-icons/) for toolbar icons.

#### Usage Example
```jsx
import DynamicTable from './DynamicTable';
import { schema } from './ExampleDynamicForm';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Email' },
  // ...
];

<DynamicTable
  columns={columns}
  data={data}
  formSchema={schema}
  onFormSubmit={handleFormSubmit}
  actions={[
    { label: 'Delete', className: 'btn-danger', onClick: handleDelete }
  ]}
/>
```

---

### 3. ExampleDynamicForm
- Demo page showing how to use DynamicTable and DynamicForm for full CRUD.
- Handles add, edit, delete, and view with validation and feedback.

---

## Customization
- **Icons:** Uses `react-icons` (IoMdAdd, MdEdit, GrFormView, MdDelete). Install with `npm install react-icons` if not present.
- **Styling:** Uses Bootstrap classes. You can override with your own CSS if needed.
- **Page size:** Change `PAGE_SIZE` in `DynamicTable.js` for more/less rows per page.
- **Field types:** Extend `DynamicForm` to support more custom fields as needed.

---

## Requirements
- React 17+
- Bootstrap 5 (CSS)
- [react-icons](https://react-icons.github.io/react-icons/)

---

## License
MIT 