import React, { useState, useMemo, useRef } from "react";

/** -----------------------------
 * Field-level Validation
 * ----------------------------*/
const validateField = (field, value, formData) => {
  if (
    field.required &&
    (value === undefined ||
      value === null ||
      value === "" ||
      (field.type === "checkbox" && !value))
  ) {
    return `${field.label} is required.`;
  }
  if (field.minLength && value && value.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters.`;
  }
  if (field.maxLength && value && value.length > field.maxLength) {
    return `${field.label} must be at most ${field.maxLength} characters.`;
  }
  if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
    return `${field.label} is invalid.`;
  }
  if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
    return `Please enter a valid email address.`;
  }
  if (field.type === "password" && value && field.confirmWith) {
    if (value !== formData[field.confirmWith]) {
      return `${field.label} does not match.`;
    }
  }
  if (field.type === "number" && value !== undefined && value !== null) {
  const num = Number(value);
  if (isNaN(num)) return `${field.label} must be a number.`;
  if (field.min !== undefined && num < field.min) {
    return `${field.label} must be at least ${field.min}.`;
  }
  if (field.max !== undefined && num > field.max) {
    return `${field.label} must be at most ${field.max}.`;
  }
}

if (field.type === "json" && value) {
  try {
    JSON.parse(value);
  } catch {
    return `${field.label} must be valid JSON.`;
  }
}

if ((field.type === "file" || field.type === "multiFile") && value) {
  if (field.required && (!value || value.length === 0)) {
    return `${field.label} is required.`;
  }
}

if (field.type === "tags" && field.required && (!value || value.length === 0)) {
  return `${field.label} must have at least one tag.`;
}

  if (field.validate && typeof field.validate === "function") {
    const customError = field.validate(value, formData);
    if (customError) return customError;
  }
  return null;
};

/** -----------------------------
 * All fields validation
 * ----------------------------*/
const validateAllFields = (schema, formData) => {
  const errors = {};
  schema.forEach((field) => {
    const error = validateField(field, formData[field.name], formData);
    if (error) {
      errors[field.name] = error;
    }
  });
  return errors;
};

/** -----------------------------
 * Dynamic Form Component
 * ----------------------------*/
const DynamicForm = ({
  schema = [],
  mode = "edit",
  formData = {},
  onChange,
  onSubmit,
  onCancel,
  singleButtonInCenter = false,
  actionButtonName = "Submit",
  twoRowForm = false,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const firstErrorRef = useRef(null);

  const memoizedSchema = useMemo(() => schema, [schema]);
  const memoizedErrors = useMemo(() => errors, [errors]);
  const isViewMode = mode === "view";

  /** -----------------------------
   * Handlers
   * ----------------------------*/
  const handleChange = (e, name, type) => {
    let value = type === "checkbox" ? e.target.checked : e.target.value;
    const newFormData = { ...formData, [name]: value };

    if (onChange) onChange(newFormData);

    setTouched((prev) => ({ ...prev, [name]: true }));
    const field = memoizedSchema.find((f) => f.name === name);
    const error = validateField(field, value, newFormData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const field = memoizedSchema.find((f) => f.name === name);
    const error = validateField(field, formData[name], formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const touchedAll = memoizedSchema.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setTouched(touchedAll);

    const newErrors = validateAllFields(memoizedSchema, formData);
    setErrors(newErrors);
    setLoading(false);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        if (firstErrorRef.current) {
          firstErrorRef.current.focus();
        }
      }, 0);
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit(formData);
      } catch (err) {
        setErrors({
          form: err.message || "An error occurred. Please try again.",
        });
      }
    }
  };

  const togglePasswordVisibility = (name) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  /** -----------------------------
   * Render
   * ----------------------------*/
  const errorList = Object.values(errors).filter(Boolean);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={errorList.length ? "formErrorSummary" : undefined}
    >
      {errors.form && (
        <div className="alert alert-danger" role="alert">
          {errors.form}
        </div>
      )}

      {/* {errorList.length > 0 && (
        <div
          className="alert alert-danger"
          id="formErrorSummary"
          tabIndex={-1}
          role="alert"
        >
          <strong>Please fix the following errors:</strong>
          <ul className="mb-0">
            {Object.entries(errors)
              .filter(([k, v]) => v && k !== "form")
              .map(([k, v]) => (
                <li key={k}>{v}</li>
              ))}
          </ul>
        </div>
      )} */}

      <div className="row">
        {memoizedSchema.map((field, idx) => {
          const disabled = isViewMode || field.disabled;
          const hasError = errors[field.name] || memoizedErrors[field.name];
          const ref = hasError && !firstErrorRef.current ? firstErrorRef : null;

          let fieldEl = null;

          switch (field.type) {
            case "input":
            case "email":
            case "date":
              fieldEl = (
                <input
                  type={field.type}
                  className={`form-control${hasError ? " is-invalid" : ""}`}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  disabled={disabled}
                  onChange={(e) => handleChange(e, field.name, field.type)}
                  onBlur={() => handleBlur(field.name)}
                  ref={ref}
                  aria-invalid={!!hasError}
                  aria-describedby={
                    hasError ? `${field.name}-error` : undefined
                  }
                />
              );
              break;

            case "textarea":
              fieldEl = (
                <textarea
                  className={`form-control${hasError ? " is-invalid" : ""}`}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  disabled={disabled}
                  onChange={(e) => handleChange(e, field.name, field.type)}
                  onBlur={() => handleBlur(field.name)}
                  ref={ref}
                  aria-invalid={!!hasError}
                  aria-describedby={
                    hasError ? `${field.name}-error` : undefined
                  }
                />
              );
              break;

            case "select":
              fieldEl = (
                <select
                  className={`form-select${hasError ? " is-invalid" : ""}`}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  disabled={disabled}
                  onChange={(e) => handleChange(e, field.name, field.type)}
                  onBlur={() => handleBlur(field.name)}
                  ref={ref}
                  aria-invalid={!!hasError}
                  aria-describedby={
                    hasError ? `${field.name}-error` : undefined
                  }
                >
                  <option value="">Select...</option>
                  {field.options.map((option, i) => (
                    <option key={i} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              );
              break;

            case "checkbox":
              fieldEl = (
                <div className="form-check">
                  <input
                    type="checkbox"
                    className={`form-check-input${
                      hasError ? " is-invalid" : ""
                    }`}
                    id={field.name}
                    name={field.name}
                    checked={formData[field.name] || false}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, field.name, field.type)}
                    ref={ref}
                    aria-invalid={!!hasError}
                    aria-describedby={
                      hasError ? `${field.name}-error` : undefined
                    }
                  />
                  <label htmlFor={field.name} className="form-check-label">
                    {field.label}
                  </label>
                </div>
              );
              break;

            case "radio":
              fieldEl = (
                <div>
                  {field.options.map((option, i) => (
                    <div className="form-check" key={i}>
                      <input
                        type="radio"
                        className={`form-check-input${
                          hasError ? " is-invalid" : ""
                        }`}
                        id={`${field.name}_${option.value}`}
                        name={field.name}
                        value={option.value}
                        checked={formData[field.name] === option.value}
                        disabled={disabled}
                        onChange={(e) =>
                          handleChange(e, field.name, field.type)
                        }
                        ref={ref}
                        aria-invalid={!!hasError}
                        aria-describedby={
                          hasError ? `${field.name}-error` : undefined
                        }
                      />
                      <label
                        htmlFor={`${field.name}_${option.value}`}
                        className="form-check-label"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              );
              break;

            case "password":
              fieldEl = (
                <div className="input-group">
                  <input
                    type={showPassword[field.name] ? "text" : "password"}
                    className={`form-control${hasError ? " is-invalid" : ""}`}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, field.name, field.type)}
                    ref={ref}
                    aria-invalid={!!hasError}
                    aria-describedby={
                      hasError ? `${field.name}-error` : undefined
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    tabIndex={-1}
                    onClick={() => togglePasswordVisibility(field.name)}
                    aria-label={
                      showPassword[field.name]
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={disabled}
                  >
                    <i
                      className={`bi ${
                        showPassword[field.name] ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              );
              break;

            case "number":
              fieldEl = (
                <input
                  type="number"
                  className={`form-control${hasError ? " is-invalid" : ""}`}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  min={field.min}
                  max={field.max}
                  disabled={disabled}
                  onChange={(e) => handleChange(e, field.name, field.type)}
                  onBlur={() => handleBlur(field.name)}
                  ref={ref}
                />
              );
              break;

            case "json":
              fieldEl = (
                <textarea
                  className={`form-control font-monospace${
                    hasError ? " is-invalid" : ""
                  }`}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  disabled={disabled}
                  placeholder="Enter valid JSON"
                  onChange={(e) => handleChange(e, field.name, field.type)}
                  onBlur={() => handleBlur(field.name)}
                  ref={ref}
                  rows={6}
                />
              );
              break;

            case "file":
              fieldEl = (
                <input
                  type="file"
                  className={`form-control${hasError ? " is-invalid" : ""}`}
                  id={field.name}
                  name={field.name}
                  disabled={disabled}
                  accept={field.accept}
                  onChange={(e) =>
                    handleChange(
                      { target: { value: e.target.files[0] } },
                      field.name,
                      field.type
                    )
                  }
                  ref={ref}
                />
              );
              break;

            case "multiFile":
              fieldEl = (
                <input
                  type="file"
                  className={`form-control${hasError ? " is-invalid" : ""}`}
                  id={field.name}
                  name={field.name}
                  multiple
                  disabled={disabled}
                  accept={field.accept}
                  onChange={(e) =>
                    handleChange(
                      { target: { value: Array.from(e.target.files) } },
                      field.name,
                      field.type
                    )
                  }
                  ref={ref}
                />
              );
              break;

            case "tags":
              fieldEl = (
                <input
                  type="text"
                  className={`form-control${hasError ? " is-invalid" : ""}`}
                  id={field.name}
                  name={field.name}
                  placeholder="Type and press comma or Enter"
                  disabled={disabled}
                  value={(formData[field.name] || []).join(", ")}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    handleChange(
                      { target: { value: tags } },
                      field.name,
                      field.type
                    );
                  }}
                  onBlur={() => handleBlur(field.name)}
                  ref={ref}
                />
              );
              break;

            case "array":
              fieldEl = (
                <div>
                  {(formData[field.name] || []).map((item, i) => (
                    <div key={i} className="d-flex gap-2 mb-2">
                      {field.fields.map((subField, j) => (
                        <input
                          key={j}
                          type="text"
                          className="form-control"
                          placeholder={subField.label}
                          value={item[subField.name] || ""}
                          onChange={(e) => {
                            const newArr = [...(formData[field.name] || [])];
                            newArr[i] = {
                              ...newArr[i],
                              [subField.name]: e.target.value,
                            };
                            handleChange(
                              { target: { value: newArr } },
                              field.name,
                              field.type
                            );
                          }}
                        />
                      ))}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      const newArr = [...(formData[field.name] || []), {}];
                      handleChange(
                        { target: { value: newArr } },
                        field.name,
                        field.type
                      );
                    }}
                  >
                    + Add Row
                  </button>
                </div>
              );
              break;
            
              case "disabledInput":
  fieldEl = (
    <input
      type="text"
      className="form-control bg-light text-dark cursor-not-allowed"
      id={field.name}
      name={field.name}
      value={field.value || ""}
      disabled
    />
  );
  break;

              default:
              fieldEl = null;
          }

          return (
            <div style={{marginBottom: '5px'}}
              className={`${twoRowForm ? "col-md-6" : "col-md-12"} col-12`}
              key={idx}
            >
              {field.type !== "checkbox" && field.type !== "radio" && (
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                  {field.required && (
                    <span className="text-danger ms-1">*</span>
                  )}
                </label>
              )}
              {fieldEl}
              {hasError && (
                <div
                  className="invalid-feedback d-block"
                  id={`${field.name}-error`}
                >
                  {errors[field.name] || memoizedErrors[field.name]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(mode === "view" || mode === "edit" || mode === "add") && (
        <div
          className={`d-flex gap-2 mt-2 ${
            singleButtonInCenter
              ? "justify-content-center"
              : "justify-content-end"
          }`}
        >
          {(mode === "edit" || mode === "add") && (
            <button
              type="submit"
              className={`btn btn-primary ${
                singleButtonInCenter ? "w-100" : ""
              }`}
              disabled={loading}
            >
              {loading && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {actionButtonName}
            </button>
          )}

          {!singleButtonInCenter && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default DynamicForm;
