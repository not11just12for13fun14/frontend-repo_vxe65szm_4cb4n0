import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, Menu, Instagram, Mail, Phone, Shield, Truck, Undo2, Hand, Palette } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

// ---------------------- UI Primitives ----------------------
const Container = ({ children, className = '' }) => (
  <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
)

const Button = ({ children, onClick, type = 'button', variant = 'solid', className = '' }) => {
  const base = 'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm font-medium'
  const styles = {
    solid: 'bg-amber-800 text-amber-50 hover:bg-amber-900 focus:ring-amber-700',
    outline: 'border border-amber-800 text-amber-900 hover:bg-amber-50/60 focus:ring-amber-700',
    ghost: 'text-amber-900 hover:bg-amber-100/60',
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}

// ---------------------- Global State (very light) ----------------------
function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('handestiy_cart')||'[]') } catch { return [] }
  })
  useEffect(()=>{ localStorage.setItem('handestiy_cart', JSON.stringify(cart)) }, [cart])
  const add = (p, qty=1) => {
    setCart(prev => {
      const idx = prev.findIndex(i=>i._id===p._id)
      if (idx>-1) {
        const next = [...prev]; next[idx].quantity += qty; return next
      }
      return [...prev, { _id: p._id, title: p.title, price: p.discount_price || p.price, image: p.images?.[0], quantity: qty }]
    })
  }
  const remove = id => setCart(prev => prev.filter(i=>i._id!==id))
  const setQty = (id, q) => setCart(prev => prev.map(i=> i._id===id? {...i, quantity: Math.max(1,q)}: i))
  const clear = () => setCart([])
  const subtotal = cart.reduce((s,i)=> s + i.price*i.quantity, 0)
  return { cart, add, remove, setQty, clear, subtotal }
}

// ---------------------- Layout ----------------------
const Logo = ({ size=24 }) => (
  <div className="flex items-center gap-2">
    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-800 to-amber-600 flex items-center justify-center text-amber-50 shadow">
      <Hand size={size-6} />
    </div>
    <span className="text-xl font-semibold tracking-wide text-amber-900">Handestiy</span>
  </div>
)

const Nav = ({ cartCount }) => {
  const [open,setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur border-b border-amber-900/10">
      <Container className="flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3"><Logo size={18} /></Link>
        <nav className="hidden md:flex items-center gap-8 text-amber-900">
          <Link to="/shop" className="hover:text-amber-700">Shop</Link>
          <Link to="/about" className="hover:text-amber-700">About</Link>
          <Link to="/contact" className="hover:text-amber-700">Contact</Link>
          <Link to="/cart" className="relative">
            <ShoppingCart size={20} />
            {cartCount>0 && <span className="absolute -top-2 -right-2 text-xs bg-amber-800 text-amber-50 rounded-full px-1.5">{cartCount}</span>}
          </Link>
        </nav>
        <button className="md:hidden" onClick={()=>setOpen(!open)}><Menu /></button>
      </Container>
      {open && (
        <div className="md:hidden border-t border-amber-900/10 bg-[#faf7f2]">
          <Container className="py-3 flex flex-col gap-3">
            <Link to="/shop" onClick={()=>setOpen(false)}>Shop</Link>
            <Link to="/about" onClick={()=>setOpen(false)}>About</Link>
            <Link to="/contact" onClick={()=>setOpen(false)}>Contact</Link>
            <Link to="/cart" onClick={()=>setOpen(false)} className="flex items-center gap-2"><ShoppingCart size={18}/> Cart</Link>
          </Container>
        </div>
      )}
    </header>
  )
}

const Footer = () => (
  <footer className="mt-16 bg-[#efe8df] border-t border-amber-900/10">
    <Container className="py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-amber-900">
      <div>
        <Logo />
        <p className="mt-3 text-sm text-amber-800/80">Handcrafted accessories, pots & paintings made with love.</p>
        <div className="flex items-center gap-3 mt-4 text-amber-800">
          <a href="#" aria-label="Instagram" className="hover:text-amber-900"><Instagram size={18}/></a>
          <a href="mailto:hello@handestiy.com" className="hover:text-amber-900"><Mail size={18}/></a>
          <a href="tel:+10000000000" className="hover:text-amber-900"><Phone size={18}/></a>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-3">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/shop?category=Accessories">Accessories</Link></li>
          <li><Link to="/shop?category=Pots">Pots</Link></li>
          <li><Link to="/shop?category=Paintings">Paintings</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-3">Policies</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/policy/privacy">Privacy Policy</Link></li>
          <li><Link to="/policy/terms">Terms & Conditions</Link></li>
          <li><Link to="/policy/shipping">Shipping & Delivery</Link></li>
          <li><Link to="/policy/returns">Return & Refund Policy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-3">We care</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><Shield size={16}/> Secure checkout ready</li>
          <li className="flex items-center gap-2"><Truck size={16}/> Reliable shipping</li>
          <li className="flex items-center gap-2"><Undo2 size={16}/> Easy returns</li>
        </ul>
      </div>
    </Container>
    <div className="border-t border-amber-900/10">
      <Container className="py-4 text-xs text-amber-800/70 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Handestiy</span>
        <span>Crafted with love.</span>
      </Container>
    </div>
  </footer>
)

// ---------------------- Pages ----------------------
const Hero = () => (
  <section className="bg-[#faf7f2]">
    <Container className="py-16 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <Logo />
        <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-amber-900">Handcrafted accessories, pots & paintings made with love.</h1>
        <p className="mt-4 text-amber-900/80">Warm, artistic and minimal pieces that add soul to your space.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/shop"><Button>Shop now</Button></Link>
          <Link to="/about"><Button variant="outline">About</Button></Link>
        </div>
      </div>
      <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-emerald-200 rounded-xl shadow-inner flex items-center justify-center">
        <Palette className="text-amber-900/40" size={120} />
      </div>
    </Container>
  </section>
)

function Home({ add }){
  const [newArrivals, setNewArrivals] = useState([])
  const [best, setBest] = useState([])
  useEffect(()=>{
    fetch(`${API_BASE}/api/products?sort=newest&limit=8`).then(r=>r.json()).then(d=>setNewArrivals(d.items||[]))
    fetch(`${API_BASE}/api/products?sort=price_desc&limit=8`).then(r=>r.json()).then(d=>setBest(d.items||[]))
  },[])
  return (
    <div>
      <Hero />
      <Container className="py-12">
        <Section title="Featured Categories">
          <div className="grid sm:grid-cols-3 gap-4">
            {['Accessories','Pots','Paintings'].map(c=> (
              <Link key={c} to={`/shop?category=${c}`} className="rounded-xl p-8 bg-[#efe8df] text-amber-900 hover:bg-[#e9e2d8] transition">
                <div className="text-lg font-medium">{c}</div>
                <div className="text-sm opacity-70">Explore handcrafted {c.toLowerCase()}</div>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="New Arrivals">
          <ProductGrid items={newArrivals} onAdd={add} />
        </Section>

        <Section title="Best Sellers">
          <ProductGrid items={best} onAdd={add} />
        </Section>

        <Section title="About Handestiy">
          <p className="text-amber-900/80 max-w-2xl">Each piece is carefully handcrafted in small batches. We believe in warm textures, earthy tones and thoughtful design that stands the test of time.</p>
        </Section>
      </Container>
    </div>
  )
}

const Section = ({ title, children }) => (
  <section className="mt-10">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-amber-900">{title}</h3>
    </div>
    {children}
  </section>
)

const ProductCard = ({ item, onAdd }) => (
  <div className="rounded-xl bg-white border border-amber-900/10 overflow-hidden">
    <div className="aspect-square bg-[#efe8df]" style={{backgroundImage: item.images?.[0]?`url(${item.images[0]})`:undefined, backgroundSize:'cover', backgroundPosition:'center'}} />
    <div className="p-4">
      <div className="font-medium text-amber-900">{item.title}</div>
      <div className="text-sm text-amber-800/80 line-clamp-2 min-h-[2.5rem]">{item.short_description}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-amber-900 font-semibold">${item.discount_price || item.price}</div>
        <Link to={`/products/${item.slug}`} className="text-sm text-amber-800 hover:text-amber-900">View</Link>
      </div>
      <Button className="mt-3 w-full" onClick={()=>onAdd(item)}>Add to Cart</Button>
    </div>
  </div>
)

const ProductGrid = ({ items, onAdd }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {items.map(p => <ProductCard key={p._id} item={p} onAdd={onAdd} />)}
  </div>
)

function Shop({ add }){
  const params = new URLSearchParams(location.search)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState(params.get('category')||'All')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  useEffect(()=>{
    const url = `${API_BASE}/api/products?category=${encodeURIComponent(category)}&sort=${sort}&page=${page}&limit=12`
    fetch(url).then(r=>r.json()).then(d=>{ setItems(d.items||[]); setTotal(d.total||0) })
  }, [category, sort, page])

  const pages = Math.max(1, Math.ceil(total/12))

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-amber-900">Shop</h2>
        <div className="text-sm text-amber-800/80">{total} items</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        {['All','Accessories','Pots','Paintings'].map(c=> (
          <button key={c} onClick={()=>{setCategory(c); setPage(1)}} className={`px-3 py-1 rounded-full border ${category===c?'bg-amber-800 text-amber-50 border-amber-800':'border-amber-900/20 text-amber-900 hover:bg-amber-50'}`}>{c}</button>
        ))}
        <select value={sort} onChange={e=>setSort(e.target.value)} className="ml-auto border border-amber-900/20 rounded-md px-3 py-1 text-sm bg-white">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div className="mt-6"><ProductGrid items={items} onAdd={add} /></div>
      <div className="mt-6 flex gap-2 justify-center">
        {Array.from({length: pages}).map((_,i)=> (
          <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 rounded border ${page===i+1?'bg-amber-800 text-amber-50 border-amber-800':'border-amber-900/20 text-amber-900 hover:bg-amber-50'}`}>{i+1}</button>
        ))}
      </div>
    </Container>
  )
}

function ProductDetail({ add }){
  const { slug } = useParams()
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  useEffect(()=>{ fetch(`${API_BASE}/api/products/${slug}`).then(r=>r.json()).then(setP) }, [slug])
  if (!p) return <Container className="py-10">Loading...</Container>
  return (
    <Container className="py-10 grid md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="aspect-square rounded-xl bg-[#efe8df]" style={{backgroundImage:p.images?.[0]?`url(${p.images[0]})`:undefined, backgroundSize:'cover', backgroundPosition:'center'}} />
        <div className="grid grid-cols-4 gap-2">
          {(p.images||[]).slice(1,5).map((img, i)=>(
            <div key={i} className="aspect-square rounded-lg bg-[#efe8df]" style={{backgroundImage:`url(${img})`, backgroundSize:'cover', backgroundPosition:'center'}} />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-semibold text-amber-900">{p.title}</h1>
        <div className="mt-2 text-amber-900 text-xl font-semibold">${p.discount_price || p.price}</div>
        <p className="mt-3 text-amber-900/80">{p.long_description || p.short_description}</p>
        <div className="mt-4 text-sm text-amber-900/80 space-y-1">
          {p.materials && <div><span className="font-medium">Materials:</span> {p.materials}</div>}
          {p.dimensions && <div><span className="font-medium">Dimensions:</span> {p.dimensions}</div>}
          <div><span className="font-medium">Stock:</span> {p.stock}</div>
          <div><span className="font-medium">Category:</span> {p.category}</div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value||'1'))} className="w-20 border border-amber-900/20 rounded-md px-3 py-2" />
          <Button onClick={()=>add(p, qty)}>Add to Cart</Button>
        </div>
      </div>
    </Container>
  )
}

function Cart({ cart, remove, setQty, subtotal }){
  const navigate = useNavigate()
  return (
    <Container className="py-10">
      <h2 className="text-2xl font-semibold text-amber-900 mb-4">Your Cart</h2>
      {cart.length===0? (
        <div className="text-amber-900/80">Your cart is empty.</div>
      ):(
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item._id} className="flex gap-4 items-center border-b border-amber-900/10 pb-4">
                <div className="w-20 h-20 rounded bg-[#efe8df]" style={{backgroundImage:item.image?`url(${item.image})`:undefined, backgroundSize:'cover', backgroundPosition:'center'}} />
                <div className="flex-1">
                  <div className="font-medium text-amber-900">{item.title}</div>
                  <div className="text-sm text-amber-800/80">${item.price}</div>
                </div>
                <input type="number" min={1} value={item.quantity} onChange={e=>setQty(item._id, parseInt(e.target.value||'1'))} className="w-20 border border-amber-900/20 rounded-md px-3 py-2" />
                <button className="text-amber-700 hover:text-amber-900" onClick={()=>remove(item._id)}>Remove</button>
              </div>
            ))}
          </div>
          <div>
            <div className="rounded-xl border border-amber-900/10 p-4 bg-white">
              <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <div className="text-xs text-amber-800/70 mt-1">Shipping calculated at checkout.</div>
              <Button className="w-full mt-4" onClick={()=>navigate('/checkout')}>Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}

function Checkout({ cart, subtotal, clear }){
  const [form, setForm] = useState({name:'', email:'', phone:'', address:'', shipping_method:'Standard Shipping'})
  const total = useMemo(()=> subtotal + (form.shipping_method==='Express Shipping'?15:5), [subtotal, form.shipping_method])
  const placeOrder = async () => {
    if (cart.length===0) return
    const items = cart.map(i=> ({ product_id: i._id, title: i.title, price: i.price, quantity: i.quantity, image: i.image }))
    const body = { items, subtotal, shipping: total - subtotal, total, customer: { name: form.name, email: form.email, phone: form.phone, address: form.address }, shipping_method: form.shipping_method }
    const res = await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.order_id) {
      clear(); location.href = `/order/${data.order_id}`
    }
  }
  return (
    <Container className="py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-semibold text-amber-900">Checkout</h2>
        <Input label="Name" value={form.name} onChange={v=>setForm({...form, name:v})} />
        <Input label="Email" value={form.email} onChange={v=>setForm({...form, email:v})} />
        <Input label="Phone" value={form.phone} onChange={v=>setForm({...form, phone:v})} />
        <TextArea label="Shipping Address" value={form.address} onChange={v=>setForm({...form, address:v})} />
        <div>
          <label className="block text-sm text-amber-900 mb-1">Shipping Method</label>
          <select className="w-full border border-amber-900/20 rounded-md px-3 py-2" value={form.shipping_method} onChange={e=>setForm({...form, shipping_method: e.target.value})}>
            <option>Standard Shipping</option>
            <option>Express Shipping</option>
          </select>
        </div>
      </div>
      <div>
        <div className="rounded-xl border border-amber-900/10 p-4 bg-white">
          <div className="font-medium text-amber-900 mb-2">Order Summary</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${(total - subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-amber-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <Button className="w-full mt-4" onClick={placeOrder}>Place Order</Button>
        </div>
      </div>
    </Container>
  )
}

const Input = ({ label, value, onChange, type='text' }) => (
  <div>
    <label className="block text-sm text-amber-900 mb-1">{label}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full border border-amber-900/20 rounded-md px-3 py-2 bg-white" />
  </div>
)

const TextArea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-amber-900 mb-1">{label}</label>
    <textarea value={value} onChange={e=>onChange(e.target.value)} className="w-full border border-amber-900/20 rounded-md px-3 py-2 bg-white min-h-[120px]" />
  </div>
)

function OrderConfirmation(){
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  useEffect(()=>{ fetch(`${API_BASE}/api/orders/${id}`).then(r=>r.json()).then(setOrder) }, [id])
  if (!order) return <Container className="py-10">Loading...</Container>
  return (
    <Container className="py-10">
      <h2 className="text-2xl font-semibold text-amber-900">Thank you! Your order is confirmed.</h2>
      <div className="mt-2 text-amber-900/80">Order ID: {order._id}</div>
      <div className="mt-6 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {order.items.map((i,idx)=> (
            <div key={idx} className="flex items-center gap-4 py-2 border-b border-amber-900/10">
              <div className="w-16 h-16 rounded bg-[#efe8df]" style={{backgroundImage:i.image?`url(${i.image})`:undefined, backgroundSize:'cover', backgroundPosition:'center'}} />
              <div className="flex-1">
                <div className="text-amber-900">{i.title}</div>
                <div className="text-sm text-amber-800/80">Qty {i.quantity}</div>
              </div>
              <div className="font-medium">${(i.price*i.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="rounded-xl border border-amber-900/10 p-4 bg-white text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-amber-900"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </Container>
  )
}

function About(){
  return (
    <Container className="py-10">
      <h2 className="text-2xl font-semibold text-amber-900">About Handestiy</h2>
      <p className="mt-3 text-amber-900/80 max-w-2xl">Handestiy was born from a love for clay, color and quiet craftsmanship. Every piece is shaped and finished by hand, making each one unique. We keep things minimal, warm and honest — the kind of objects that make your everyday feel special.</p>
    </Container>
  )
}

function Contact(){
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const submit = () => { alert('Thanks for reaching out!') }
  return (
    <Container className="py-10">
      <h2 className="text-2xl font-semibold text-amber-900">Contact</h2>
      <div className="mt-4 space-y-4 max-w-xl">
        <Input label="Name" value={form.name} onChange={v=>setForm({...form, name:v})} />
        <Input label="Email" value={form.email} onChange={v=>setForm({...form, email:v})} />
        <TextArea label="Message" value={form.message} onChange={v=>setForm({...form, message:v})} />
        <Button onClick={submit}>Send</Button>
      </div>
      <div className="mt-8 text-sm text-amber-900/80">Email: hello@handestiy.com</div>
    </Container>
  )
}

function Policy({ title }){
  return (
    <Container className="py-10">
      <h2 className="text-2xl font-semibold text-amber-900">{title}</h2>
      <div className="mt-4 space-y-3 text-amber-900/80 max-w-3xl">
        <p>Placeholder policy content for {title}. Replace with your actual policy text.</p>
        <p>We value your trust and are committed to transparency.</p>
      </div>
    </Container>
  )
}

// ---------------------- Admin (basic) ----------------------
function AdminLogin(){
  const [email, setEmail] = useState('admin@handestiy.com')
  const [password, setPassword] = useState('admin123')
  const navigate = useNavigate()
  const login = async () => {
    const res = await fetch(`${API_BASE}/api/admin/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password })})
    if (res.ok) {
      const data = await res.json(); localStorage.setItem('handestiy_admin_token', data.token); navigate('/admin')
    } else alert('Invalid credentials')
  }
  return (
    <Container className="py-10 max-w-md">
      <h2 className="text-2xl font-semibold text-amber-900">Admin Login</h2>
      <div className="mt-4 space-y-3">
        <Input label="Email" value={email} onChange={setEmail} />
        <Input label="Password" value={password} onChange={setPassword} />
        <Button className="w-full" onClick={login}>Login</Button>
      </div>
    </Container>
  )
}

function AdminLayout({ children }){
  const navigate = useNavigate()
  const token = localStorage.getItem('handestiy_admin_token')
  useEffect(()=>{ if (!token) navigate('/admin/login') }, [token])
  return (
    <div>
      <div className="bg-[#faf7f2] border-b border-amber-900/10">
        <Container className="py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4 text-sm">
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
          </div>
        </Container>
      </div>
      <Container className="py-8">{children}</Container>
    </div>
  )
}

function AdminDashboard(){
  const [orders, setOrders] = useState([])
  useEffect(()=>{
    const t = localStorage.getItem('handestiy_admin_token')
    fetch(`${API_BASE}/api/admin/orders`, { headers: { Authorization: `Bearer ${t}` }}).then(r=>r.json()).then(setOrders)
  },[])
  const totalSales = orders.reduce((s,o)=>s+o.total,0)
  return (
    <AdminLayout>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat title="Total Sales" value={`$${totalSales.toFixed(2)}`} />
        <Stat title="Orders" value={orders.length} />
        <Stat title="Top Items" value="—" />
      </div>
      <h3 className="mt-8 mb-3 text-lg font-semibold text-amber-900">Recent Orders</h3>
      <div className="bg-white border border-amber-900/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#efe8df]">
            <tr>
              <th className="text-left p-3">Order ID</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Date</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o=> (
              <tr key={o._id} className="border-t border-amber-900/10">
                <td className="p-3">{o._id}</td>
                <td className="p-3">{o.customer?.name}</td>
                <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-3">${o.total.toFixed(2)}</td>
                <td className="p-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

const Stat = ({ title, value }) => (
  <div className="rounded-xl border border-amber-900/10 p-4 bg-white">
    <div className="text-sm text-amber-800/80">{title}</div>
    <div className="text-2xl font-semibold text-amber-900">{value}</div>
  </div>
)

function AdminProducts(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title:'', slug:'', price:0, category:'Accessories', stock:1, images:[], short_description:'' })
  const token = localStorage.getItem('handestiy_admin_token')
  const load = () => fetch(`${API_BASE}/api/products?limit=1000`).then(r=>r.json()).then(d=>setItems(d.items||[]))
  useEffect(()=>{ load() }, [])
  const save = async () => {
    const body = { ...form, discount_price: form.discount_price||undefined, long_description: form.long_description||'', materials: form.materials||'', dimensions: form.dimensions||'', active: true }
    const res = await fetch(`${API_BASE}/api/admin/products`, { method:'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    if (res.ok) { setForm({ title:'', slug:'', price:0, category:'Accessories', stock:1, images:[], short_description:'' }); load() } else alert('Failed')
  }
  return (
    <AdminLayout>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">Products</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(p=> (
              <div key={p._id} className="border border-amber-900/10 rounded-xl bg-white overflow-hidden">
                <div className="aspect-video bg-[#efe8df]" style={{backgroundImage:p.images?.[0]?`url(${p.images[0]})`:undefined, backgroundSize:'cover', backgroundPosition:'center'}} />
                <div className="p-3 text-sm">
                  <div className="font-medium text-amber-900">{p.title}</div>
                  <div className="text-amber-800/80">${p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-amber-900 mb-3">Add Product</h3>
          <div className="space-y-3 bg-white border border-amber-900/10 rounded-xl p-4">
            <Input label="Title" value={form.title} onChange={v=>setForm({...form, title:v})} />
            <Input label="Slug" value={form.slug} onChange={v=>setForm({...form, slug:v})} />
            <Input label="Price" value={form.price} onChange={v=>setForm({...form, price:parseFloat(v||'0')})} />
            <Input label="Discount Price" value={form.discount_price||''} onChange={v=>setForm({...form, discount_price: v?parseFloat(v):''})} />
            <Input label="Category" value={form.category} onChange={v=>setForm({...form, category:v})} />
            <Input label="Stock" value={form.stock} onChange={v=>setForm({...form, stock: parseInt(v||'1')})} />
            <Input label="Images (comma separated URLs)" value={form.images.join(',')} onChange={v=>setForm({...form, images: v.split(',').map(s=>s.trim()).filter(Boolean)})} />
            <TextArea label="Short Description" value={form.short_description} onChange={v=>setForm({...form, short_description:v})} />
            <Button className="w-full" onClick={save}>Save</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function AdminOrders(){
  const [orders, setOrders] = useState([])
  const token = localStorage.getItem('handestiy_admin_token')
  const load = () => fetch(`${API_BASE}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` }}).then(r=>r.json()).then(setOrders)
  useEffect(()=>{ load() }, [])
  const update = async (oid, status) => {
    await fetch(`${API_BASE}/api/admin/orders/${oid}/status`, { method:'PATCH', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
    load()
  }
  return (
    <AdminLayout>
      <h3 className="text-lg font-semibold text-amber-900 mb-3">Orders</h3>
      <div className="bg-white border border-amber-900/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#efe8df]">
            <tr>
              <th className="text-left p-3">Order ID</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th><th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o=> (
              <tr key={o._id} className="border-t border-amber-900/10">
                <td className="p-3">{o._id}</td>
                <td className="p-3">{o.customer?.name}</td>
                <td className="p-3">${o.total.toFixed(2)}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">
                  <select value={o.status} onChange={e=>update(o._id, e.target.value)} className="border border-amber-900/20 rounded-md px-2 py-1">
                    {['Pending','Shipped','Delivered','Cancelled'].map(s=> <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

// ---------------------- App Shell with Routing ----------------------
function Shell(){
  const cartState = useCart()
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Nav cartCount={cartState.cart.length} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home add={cartState.add} />} />
          <Route path="/shop" element={<Shop add={cartState.add} />} />
          <Route path="/products/:slug" element={<ProductDetail add={cartState.add} />} />
          <Route path="/cart" element={<Cart {...cartState} />} />
          <Route path="/checkout" element={<Checkout {...cartState} />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy/:slug" element={<Policy title="Policy" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default Shell
