import React, { useState } from 'react'
import * as Yup from 'yup'
import { Form, Formik, Field, ErrorMessage } from 'formik'
import './forms.css'

type RegisterformProps = {
  isLoading: boolean
  submitHandle: any
}

const Registerform: React.FC<RegisterformProps> = function (props) {
  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
          nickname: ''
        }}
        onSubmit={(values, hepls) => {
          if(!props.isLoading) props.submitHandle(values)
          
          hepls.setSubmitting(false)
        }}
        validationSchema={
          Yup.object().shape({
            email: Yup.string().required('поле обязательно').email('email не по формату.'),
            password: Yup.string().required('поле обязательно').min(6, 'пароль не короче 6').max(56, 'пароль не длиннее 56'),
            nickname: Yup.string().required('поле обязательно').min(3, 'ник не короче 3').max(56, 'ник не длиннее 56')
          })
        }
        validateOnBlur
      >

        {(formik) => (
          <Form>
            <div className="form-group">
              <span className="form-group__error"><ErrorMessage name="email" /></span>
              <Field placeholder="email" name="email" />
            </div>
            <div className="form-group">
              <span className="form-group__error"><ErrorMessage name="password" /></span>
              <Field placeholder="password" type="password" name="password" />
            </div>
            <div className="form-group">
              <span className="form-group__error"><ErrorMessage name="nickname" /></span>
              <Field placeholder="nickname" name="nickname" />
            </div>
            <button type="submit" className="btn" disabled={!formik.isValid || props.isLoading}>
              регистрация
            </button>
            <button type="reset" className="btn btn--reset">
              <i className="material-icons">replay</i>
            </button>
          </Form>
        )}

      </Formik>
    </div>
  );
}

export default Registerform