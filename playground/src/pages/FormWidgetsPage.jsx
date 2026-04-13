import { createElement } from "react";

import { EdtsForm } from "@packages/edtsForm/src/EdtsForm";
import { EdtsFormLogin } from "@packages/edtsFormLogin/src/EdtsFormLogin";
import { EdtsInput } from "@packages/edtsInput/src/EdtsInput";
import { EdtsSelectBox } from "@packages/edtsSelectBox/src/EdtsSelectBox";
import { Datepicker } from "@packages/edtsdatepicker/src/Datepicker";

import { Section } from "../components/Section";

export function FormWidgetsPage(props) {
  const {
    formState,
    setFormState,
    titleAttribute,
    employeeAssociation,
    employeeDataSource,
    employeeNameAttr,
    startDateAttribute,
    endDateAttribute,
    formSubmitAction,
    inputChangeAction,
    selectChangeAction,
    datepickerChangeAction,
    createAction,
  } = props;

  return (
    <Section
      eyebrow="Form widgets"
      title="Input, Select, Datepicker, and Form"
      description="This section mirrors a booking form and keeps the visual language aligned with your widgets."
    >
      <EdtsForm
        title="Create Booking"
        description="Try validation, selection, and date range interactions directly in the browser."
        submitCaption="Submit Booking"
        cancelCaption="Reset"
        showCancelButton
        showFooter
        compact={false}
        submitOnEnter
        onSubmitAction={formSubmitAction}
        onCancelAction={createAction(() => {
          setFormState({
            title: "",
            employee: null,
            startDate: new Date("2026-04-09T11:00:00"),
            endDate: new Date("2026-04-09T12:00:00"),
          });
        })}
        content={
          <div className="playground-form-stack">
            <EdtsInput
              valueAttribute={titleAttribute}
              label="Meeting title"
              placeholder="Enter a meeting title"
              helperText="Use a concise title for the booking."
              inputType="text"
              required
              requiredMessage="Meeting title is required."
              validateOnChange
              onChangeAction={inputChangeAction}
            />
            <EdtsSelectBox
              selectType="association"
              associationValue={employeeAssociation}
              valueAttribute={null}
              optionsSource={employeeDataSource}
              optionLabelAttr={employeeNameAttr}
              label="Employee"
              placeholder="Select employee"
              helperText="Pick the booking owner."
              isClearable
              isSearchable
              required
              requiredMessage="Employee is required."
              validateOnChange
              onChangeAction={selectChangeAction}
            />
            <Datepicker
              dateAttribute={startDateAttribute}
              endDateAttribute={endDateAttribute}
              pickerMode="range"
              labelCaption="Selected date"
              placeholderText="Choose start"
              endPlaceholderText="Choose end"
              helperText="Date is locked after selection, but time stays editable."
              dateFormatPattern="dd MMM yyyy"
              showCalendarIcon
              allowClear
              dateReadOnly={false}
              disabled={false}
              onChangeAction={datepickerChangeAction}
            />
          </div>
        }
      />

      <EdtsFormLogin
        showHeader={false}
        title="Login"
        description="Login-style wrapper dengan tombol utama center di bawah, tetap bisa diisi widget via content slot."
        submitCaption="Login"
        showSecondaryButton={false}
        submitOnEnter
        showToastOnSubmit
        toastMessage=""
        toastType="error"
        toastPosition="topRight"
        toastAutoClose={2400}
        onBackAction={createAction(() => {
          setFormState(state => ({ ...state }));
        })}
        onHelperAction={createAction(() => {
          setFormState(state => ({ ...state }));
        })}
        onSubmitAction={formSubmitAction}
        content={
          <div className="playground-form-stack">
            <EdtsInput
              valueAttribute={titleAttribute}
              label="Username"
              placeholder="Masukkan username"
              helperText="Demo memakai attribute title yang sama dari playground."
              inputType="text"
              required
              requiredMessage="Username is required."
              validateOnChange
              onChangeAction={inputChangeAction}
            />
            <div className="edts-input">
              <label className="edts-input__label">Password</label>
              <input className="edts-input__control" type="password" placeholder="Masukkan password" />
            </div>
          </div>
        }
      />
    </Section>
  );
}
