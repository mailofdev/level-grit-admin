import { useState, useRef } from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Alert from '../../components/common/Alert';

export default function PlanButtonWithDatePicker({ client, navigate }) {
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [actionType, setActionType] = useState(null); // 'add' or 'preview'
  const toast = useRef(null);

  const handlePlanAction = (type) => {
    setActionType(type);
    setShowDateDialog(true);
  };

  const handleConfirmDate = () => {
    if (!selectedDate) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Date Required',
        detail: 'Please select a date',
        life: 3000
      });
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const isView = actionType === 'preview';

    navigate(`/adjust-plan/${client.clientId}`, {
      state: { 
        client, 
        isView,
        initialDate: formattedDate 
      },
    });

    setShowDateDialog(false);
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365); // Allow planning up to 1 year ahead

  return (
    <>
      <Toast ref={toast} />
      
      <SplitButton
        label="Plan"
        icon="pi pi-plus"
        className="bg-button fs-6 text-secondary btn-sm border-0 rounded-3 shadow-sm"
        style={{ color: "white" }}
        model={[
          {
            label: "Add",
            icon: "pi pi-pencil",
            command: () => handlePlanAction('add')
          },
          {
            label: "Preview",
            icon: "pi pi-eye",
            command: () => handlePlanAction('preview')
          },
        ]}
      />

      <Dialog
        header={
          <div className="d-flex align-items-center">
            <i className={`pi ${actionType === 'preview' ? 'pi-eye' : 'pi-pencil'} me-2`}></i>
            <span>{actionType === 'preview' ? 'Preview' : 'Add/Edit'} Meal Plan</span>
          </div>
        }
        visible={showDateDialog}
        style={{ width: '400px' }}
        onHide={() => setShowDateDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowDateDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Continue"
              icon="pi pi-check"
              onClick={handleConfirmDate}
              autoFocus
            />
          </div>
        }
      >
        <div className="p-3">
          <div className="mb-3">
            <strong>Client:</strong> {client?.fullName || 'N/A'}
          </div>
          
          <div className="mb-3">
            <label className="fw-semibold mb-2 d-block">
              📅 Select Date
            </label>
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value)}
              dateFormat="dd M yy"
              showIcon
              minDate={actionType === 'add' ? today : null}
              maxDate={maxDate}
              inline
              className="w-100"
            />
          </div>

          {actionType === 'add' && selectedDate && selectedDate.toDateString() !== today.toDateString() && (
            <Alert
              type="info"
              message="You can only edit today's plan. Future dates will be read-only."
              dismissible={false}
              position="inline"
              className="p-2 small"
            />
          )}

          {actionType === 'preview' && (
            <Alert
              type="info"
              message="Opening in preview mode (read-only)"
              dismissible={false}
              position="inline"
              className="p-2 small"
            />
          )}
        </div>
      </Dialog>
    </>
  );
}