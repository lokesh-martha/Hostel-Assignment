export default function ContactPage() {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
  
        <p className="mb-4">
          We'd love to hear from you! Whether you have a question about room availability, student services, or anything else, our team is ready to help.
        </p>
  
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">📍 Address</h2>
            <p>Hostel Management Office</p>
            <p>123 University Lane</p>
            <p>Hyderabad, Telangana 500001</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold">📞 Phone</h2>
            <p>+91 98765 43210</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold">📧 Email</h2>
            <p>support@hostelhub.in</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold">🕒 Office Hours</h2>
            <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
            <p>Saturday: 10:00 AM – 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    );
  }
  