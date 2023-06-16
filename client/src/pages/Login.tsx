import React , {useState}from 'react'

export default function Login() {
      const [isLogin, setIsLogin] = useState(true)

  return (
    <section className=" max-w-lg pt-16 mx-auto fade-down">
      <div className="bg-white rounded-lg p-6 shadow-lg">

      <div className="flex justify-between gap-x-2">
            <button className={`login-btn ${isLogin ? 'bg-[#84a98c] text-white' : 'hover:bg-[#84a98c90]'}`} onClick={() => setIsLogin(true)}>Login</button>
            <button className={`login-btn ${!isLogin ? 'bg-[#84a98c]' : 'hover:bg-[#84a98c90]'}`} onClick={() => setIsLogin(false)}>Sign Up</button>
      </div>
      <form className="flex flex-col gap-y-2 mt-4">
            {isLogin ? (
                  <>
            <label htmlFor="email">Email Address</label>
            <input type="email" autoFocus name="email" id="email" className="login-input" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className="login-input" />
                  </>
            ) : (
                  <>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" autoFocus name="name" id="name" className="login-input" />
                  <label htmlFor="email">Email Address</label>
                  <input type="email" autoFocus name="email" id="email" className="login-input" />
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" id="password" className="login-input" />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" className="login-input" />
                  <label htmlFor="img-upload"></label>
                  <input type="file" name="img-upload" id="img-upload" className="login-input" />
                  </>
            )}
            
            <button className="bg-[#84a98c] transition-colors duration-200 rounded-md p-2 my-2 hover:bg-[#638169]" type="submit">Submit</button>
            <button className="bg-[#cad2c5] rounded-md p-2 transition-colors duration-200 hover:bg-[#bbc8b3]" type="button">Get Guest User Credentials</button>
      </form>
      </div>
    </section>
  )
}
