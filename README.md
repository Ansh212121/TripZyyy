
# 🚗 TripZyyy

**TripZyyy** is an end-to-end carpooling and ride-sharing platform built with the **MERN stack** and **Next.js 14**. It allows users to post rides, book available ones, and share contact details securely once a booking is confirmed — helping reduce fuel costs and promote sustainable travel.

🗺️ Now with **Google Maps integration** — search for pickup/drop locations, visualize routes, and make smarter travel decisions.

![WhatsApp Image 2025-07-24 at 17 04 22_356d4c52](https://github.com/user-attachments/assets/2c38a2be-7ef7-4206-b040-84b2ea896770)

![WhatsApp Image 2025-07-24 at 17 04 22_25e7c310](https://github.com/user-attachments/assets/1f30fa0f-1d65-4eed-9c8e-aa91e22413f5)

![WhatsApp Image 2025-07-24 at 17 04 23_f142bb1f](https://github.com/user-attachments/assets/c38050e1-648d-4061-881c-dd337024fea2)

<img width="1873" height="845" alt="Screenshot 2025-07-25 002917" src="https://github.com/user-attachments/assets/cf3f9302-da0e-491c-bd73-b86977138a22" />
<img width="843" height="710" alt="Screenshot 2025-07-25 002930" src="https://github.com/user-attachments/assets/23cb2818-b161-4512-889e-5b1d0715ccc3" />

---

## 🌟 Features

- 🔐 Secure authentication with **Clerk**
- 📌 Post a ride as a driver
- 🎯 Book a ride as a passenger
- 📤 Accept or decline incoming ride requests
- 📱 Contact info shared after acceptance (email + phone)
- 🗺️ Browse and choose pickup/drop locations via **Google Maps**
- 🚘 View optimized routes between locations using **Maps Directions API**
- 🌱 Environmentally conscious & budget-friendly carpooling
- 💻 Responsive dark-themed UI using **Tailwind CSS**
- 🧾 Booking history & "My Rides" pages

---

## 🧰 Tech Stack

| Layer      | Tech Used                       |
|------------|---------------------------------|
| Frontend   | Next.js 14, React, Tailwind CSS |
| Backend    | Node.js, Express.js             |
| Auth       | Clerk                           |
| Maps       | Google Maps JavaScript API      |
| Database   | MongoDB with Mongoose           |
| Deployment | Vercel (frontend), Render/Railway (backend) |

---

## 📁 Folder Structure

```

project-root/
├── app/
│   ├── api/              # Backend API Routes (Next.js API handlers)
│   ├── bookings/         # User booking pages
│   ├── rides/            # Ride posting and viewing pages
│   ├── components/       # Shared UI components (Cards, Modals, etc.)
│   └── layout.tsx        # Root layout and structure
├── lib/                  # Database and Clerk config
├── public/               # Static assets
├── styles/               # Global CSS & Tailwind config
├── .env.local            # Environment variables (not committed)
├── .gitignore
├── README.md
└── package.json

````

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/TripZyyy.git
cd TripZyyy
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_uri
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> ⚠️ **Never commit this file** — it should already be in `.gitignore`.

### 4. Run the App Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Usage Flow

1. **Signup/Login** using Clerk authentication

2. **Post a Ride** with date, time, location, seat, and price

3. **Use Google Maps to search and select locations**

4. **Browse & Book Rides** based on availability

5. **Driver receives request** – can accept or decline

6. **If accepted**, both parties get access to:

   * 📞 Phone number
   * 📧 Email address

7. Users can view activity in:

   * 🧾 Bookings
   * 🚗 My Rides

---

## 📦 Deployment

### Frontend – Vercel

* Connect GitHub repo to [Vercel](https://vercel.com)
* Add environment variables in **Project Settings → Environment**
* Deploy from `main` or any branch

### Backend – Railway or Render

* Create a new project on [Railway](https://railway.app) or [Render](https://render.com)
* Deploy Express backend (optional if only using Next.js API)
* Add the same `.env` variables
* Hit deploy 🚀

---

## 🛡️ Security Tips

* Ensure `.env.local` is in `.gitignore`
* **Rotate secrets immediately** if `.env` is ever leaked
* Restrict **Google Maps API key** using HTTP referrers
* Always use **HTTPS**
* Use [Clerk's domain verification](https://clerk.com/docs) for production apps

---

## 🤝 Contributing

We welcome all contributions! Here's how you can help:

```bash
# Fork the repo

# Create a new branch
git checkout -b feature/YourFeature

# Commit your changes
git commit -m "Add YourFeature"

# Push to GitHub
git push origin feature/YourFeature

# Open a Pull Request 🚀
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Author

Built with ❤️ by **Ansh**

---

## 🌱 Let’s Make Travel Smarter

TripZyyy helps build a more sustainable future by encouraging carpooling and reducing emissions.
Save money, meet people, and protect the planet — one ride at a time.

