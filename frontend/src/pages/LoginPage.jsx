import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Store } from 'lucide-react';
import './BusinessFlow.css';

const demoEmail = 'owner@growpilot.demo';

export default function LoginPage({ onLogin, onToast }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState('demo123');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.includes('@')) {
      onToast?.('Enter a valid dummy email address.', 'warning');
      return;
    }

    if (!password.trim()) {
      onToast?.('Password can stay simple in the demo.', 'warning');
      return;
    }

    const nextPath = onLogin?.({ email, name: email.split('@')[0] }) || '/businesses';
    navigate(nextPath);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__shell">
        <section className="auth-page__brand">
          <div className="auth-brand__top">
            <h1 className="auth-brand__title">Run your business from one place.</h1>
            <p className="auth-brand__copy">
              Sign in with your demo email and continue to your business dashboard.
            </p>

            <div className="auth-brand__stats">
              <div className="auth-brand__stat">
                <strong>2</strong>
                <span>demo businesses</span>
              </div>
              <div className="auth-brand__stat">
                <strong>8</strong>
                <span>business categories</span>
              </div>
              <div className="auth-brand__stat">
                <strong>1</strong>
                <span>quick sign-in step</span>
              </div>
            </div>
          </div>

          <div className="auth-brand__footer">
            <div className="auth-note" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.82)' }}>
              <ShieldCheck size={16} />
              Login is local to your browser for demo purposes.
            </div>
          </div>
        </section>

        <section className="auth-page__panel">
          <div className="auth-card">
            <div className="auth-card__header">
              <h2>Sign in with a demo email</h2>
              <p>
                Use any email address to test the product flow.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="owner@growpilot.demo"
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Any demo password"
                />
              </div>

              <div className="auth-form__row">
                <button type="submit" className="btn btn-primary">
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="auth-note">
              <CheckCircle2 size={16} />
              Session details are stored locally in your browser.
            </div>

            <div className="auth-footer">
              <span>Default demo email: {demoEmail}</span>
              <span>
                <Store size={14} style={{ display: 'inline', marginRight: 6 }} />
                Bakery and grocery demo flows
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}