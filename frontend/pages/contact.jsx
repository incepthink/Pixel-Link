import React, { useState } from 'react';
import notify from '../utils/notify';
import axios from 'axios';

const styles = {
  input: 'bg-transparent border-[1px] border-gray-600 p-3 px-4 mb-3 flex placeholder-gray-300 font-thin rounded-lg outline-custom-blue ',
}

const contact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const ContactUsData = async (body) => {
    const response = await axios.post(process.env.EMAIL_LAMBDA_URL, body);
    return response.data;
  };

  const sendMail = async (e) => {
    e.preventDefault();
    notify('Sending Mail, Please Hold On');
    try {
      const response = await ContactUsData({
        subject: subject,
        clientEmail: clientEmail,
        message: `Name: ${firstName} \nMessage: ${message}`,
        targetMail: 'contact@hashcase.co',
      });
      console.log(response);
      if (response.success === true) {
        console.log('Mail Sent');
        notify('Mail Sent', 'success');
      }
    } catch (err) {
      console.log(err);
      notify('Error Sending Mail', 'error');
    }
  }

  return (
    <div className='text-white flex min-h-screen items-center justify-center font-manrope'>
      <div className='max-w-lg'>
        <h1 className='text-custom-blue text-3xl mb-4'>Get in touch</h1>
        <form className=''>
          <div className='flex gap-x-4'>
            <input type='text' className={styles.input + ''} placeholder='Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type='text' className={styles.input + ''} placeholder='Email' value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          </div>
          <input type='text' className={styles.input + 'w-full'} placeholder='Subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
          <textarea className={styles.input + 'w-full h-48'} placeholder='Your message goes here....' value={message} onChange={(e) => setMessage(e.target.value)} />
          <div className='w-full flex items-center'>
            <button
              className='my-4 border-1 border-custom-blue rounded-lg py-2 w-[40%]'
              onClick={sendMail}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default contact