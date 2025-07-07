'use client';
import { useEffect, useState } from "react";
import bcrypt from 'bcryptjs';
import { useRouter } from "next/navigation";

export default function ProfileEdit()
{

  const [user, setUser] = useState([]);
 
  const [formData, setFormData] = useState({
   username: '',
   gmail: '',
   password: '',
   file: null,
 });
 const router = useRouter();
 

  useEffect(()=> {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  
  },[])


  useEffect(() => {
  if (user) {
    setFormData({
      username: user.username || '',
      gmail: user.gmail || '',
      password:  '',
      file: null,
    });
  }
}, [user]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
    setFormData((prev) => ({
      ...prev,
      file: file,
    }));
  } else {
    alert("Yalnız PNG və ya JPG faylları qəbul edilir.");
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();  
    if (formData.password.length < 5) {
     alert("The password must be at least 5 symbols.");
    return; 
  }
 

   const hashedPassword = await bcrypt.hash(formData.password, 10);
  const form = new FormData();
  form.append('username', formData.username);
  form.append('gmail', formData.gmail);
  form.append('password', hashedPassword);
  form.append('file', formData.file);

  try {
    const res = await fetch('/api/profile', {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      alert("Profil uğurla yeniləndi.");
      router.push('/profile');
    } else {
      alert("Xəta baş verdi.");
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("Server xətası.");
  }
};
 
  if(!user) return (<div className="flex justify-center items-center h-screen bg-gray-100">Loading... </div>)
   
    return(
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-[500px] h-[600px] bg-white rounded-xl shadow-xl">
              
                <div className="flex flex-col  justify-center h-full p-6">
                   <form method="POST" encType="multipart/form-data" className="flex flex-col" onSubmit={handleSubmit}>
                       <span className="text-2xl font-semibold text-center p-4">Edit Profile</span>
                    <input onChange={handleChange} type="text" name="username" value={formData.username} className="w-full p-2 mb-4 border border-gray-300 rounded" />
                    <input onChange={handleChange} type="email" name="gmail" value={formData.gmail} className="w-full p-2 mb-4 border border-gray-300 rounded" />
                    <input onChange={handleChange} type="password" name="password" placeholder="New Password..." value={formData.password} className="w-full p-2 mb-4 border border-gray-300 rounded"  required />
                    <input onChange={handleFileChange}
                      type="file"
                      className="block w-full text-sm text-gray-500
                                 file:mr-4 file:py-2 file:px-4
                                 file:rounded-full file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-blue-50 file:text-blue-700
                                 hover:file:bg-blue-100
                                 cursor-pointer mb-10"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Changes</button>
                   </form>
                </div>
            </div>
         </div>
    )
}