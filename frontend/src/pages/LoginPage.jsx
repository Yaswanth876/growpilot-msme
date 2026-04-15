import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Store } from 'lucide-react';
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

    onLogin?.({ email, name: email.split('@')[0] });
    navigate('/businesses');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__shell">
        <section className="auth-page__brand">
          <div className="auth-brand__top">
            <div className="auth-brand__badge">
              <Sparkles size={14} />
              Dummy login for MSME demo
            </div>
            <h1 className="auth-brand__title">Run your business from one place.</h1>
            <p className="auth-brand__copy">
              Sign in with a dummy email, choose your business type, and jump into a practical dashboard for bakery or grocery operations.
            </p>

            <div className="auth-brand__stats">
              <div className="auth-brand__stat">
                <strong>2</strong>
                <span>active demo businesses</span>
              </div>
              <div className="auth-brand__stat">
                <strong>8</strong>
                <span>business categories in flow</span>
              </div>
              <div className="auth-brand__stat">
                <strong>1</strong>
                <span>simple email login step</span>
              </div>
            </div>
          </div>

          <div className="auth-brand__footer">
            <div className="auth-note" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.82)' }}>
              <ShieldCheck size={16} />
              This demo keeps the login local in the browser. No backend auth, no passwords stored remotely.
            </div>
          </div>
        </section>

        <section className="auth-page__panel">
          <div className="auth-card">
            <div className="auth-card__header">
              <h2>Sign in with a demo email</h2>
              <p>
                Use any email address you want for testing. After login, you will pick the business type and continue to the bakery or grocery dashboard.
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
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEmail(demoEmail);
                    setPassword('demo123');
                  }}
                >
                  Use dummy email
                </button>
                <button type="submit" className="btn btn-primary">
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="auth-note">
              <CheckCircle2 size={16} />
              The form is intentionally simple. The email is stored locally so the next page can show your demo session.
            </div>

            <div className="auth-footer">
              <span>Default demo email: {demoEmail}</span>
              <span>
                <Store size={14} style={{ display: 'inline', marginRight: 6 }} />
                Built for bakery and grocery flows
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}