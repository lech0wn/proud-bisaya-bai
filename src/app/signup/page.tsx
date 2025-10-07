export default function Login() {
  return (
    <form action="/auth/signup" method="post">
      <label htmlFor="firstName">First Name</label>
      <input name="firstName" />
      
      <label htmlFor="lastName">Last Name</label>
      <input name="lastName" />
      
      <label htmlFor="email">Email</label>
      <input name="email" type="email" />
      
      <label htmlFor="password">Password</label>
      <input type="password" name="password"/>
      
      <button>Sign Up</button>
    </form>
  )
}