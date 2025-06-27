# 📝 Form Builder Web Application

A dynamic, full-stack form builder that allows administrators to create, manage, and share customizable online forms. Users can submit responses, and admins can export all submissions to Excel for further analysis.

---

## 🚀 Features

- 🔐 **Admin Authentication** (Login/Register)
- 🧩 **Dynamic Form Builder** with drag-and-drop interface
- 📄 Multiple field types (Text, Radio, Checkbox, Textarea)
- 🔗 **Shareable Form Link** generation
- 📥 **User Response Submission**
- 📊 **Admin Dashboard** to view responses
- 📤 **Export to Excel (.xlsx)** functionality
- 📁 Lightweight data storage using JSON

---

## 🛠️ Tech Stack

### Frontend
- [React.js](https://reactjs.org)
- [Material UI (MUI)](https://mui.com)
- JavaScript, HTML, CSS

### Backend
- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)
- [ExcelJS](https://www.npmjs.com/package/exceljs)
- [UUID](https://www.npmjs.com/package/uuid)
- [Axios](https://axios-http.com)

---

## 📂 Project Structure

```
Form-creation-main/
├── backend/
│   ├── server.js
│   ├── db.json
│   ├── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── FormBuilder.js
│   │   │   ├── FormResponses.js
│   │   │   └── ExportResponses.js
│   ├── public/
│   ├── package.json
```

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/form-builder.git
cd form-builder
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend
```bash
cd ../frontend
npm install
npm start
```

---

## ✅ Usage

1. Register or log in as admin.
2. Create a new form using the builder.
3. Share the generated link with users.
4. View responses from the dashboard.
5. Export collected responses to Excel.

---

## 📷 Screenshots

> Add screenshots of:
- Landing UI
  ![Landing UI](https://github.com/shivammude/Form-Builder/blob/master/Landing%20UI.png)
- Your Forms
  ![Your_Forms](https://github.com/shivammude/Form-Builder/blob/master/Your%20Forms.png)
- Creation of New Form
  ![Creation Of New Form](https://github.com/shivammude/Form-Builder/blob/master/Creation%20Of%20New%20Form.png)
- Add Fields
  ![Add Fields](https://github.com/shivammude/Form-Builder/blob/master/Add%20Fields.png) 
- Dropdown_date
  ![Dropdown_date](https://github.com/shivammude/Form-Builder/blob/master/Dropdown_date.png)
- Generation Of Link
  ![Generation Of Link](https://github.com/shivammude/Form-Builder/blob/master/Generation%20Of%20Link.png)
- Form Creation
  ![Form Creation](https://github.com/shivammude/Form-Builder/blob/master/Form%20creation.png)
- User Form Creation
  ![User Form Creation](https://github.com/shivammude/Form-Builder/blob/master/UserFormCreation.png)
- Responses
  ![Responses](https://github.com/shivammude/Form-Builder/blob/master/Responses.png)
- Admin Dashboard
  ![Admin Dashboard](https://github.com/shivammude/Form-Builder/blob/master/AdminDashboard.png)
---

## ⚠️ Limitations

- Data is stored locally in a JSON file, not suitable for large-scale applications.
- No cloud deployment configured.
- Passwords are stored in plain text (not secure for production).

---

## 📌 Future Improvements

- Integrate MongoDB or PostgreSQL for persistent data storage
- Add role-based access control
- Mobile-responsive UI improvements
- Deployment on platforms like Heroku, Vercel, or AWS

---

## 🧑‍💻 Author

**Shivam Mude**  
**Khalil Shaikh**

*Built as part of a full-stack development project*

---

## 📃 License

This project is open-source and free to use for educational and development purposes.

