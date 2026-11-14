import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import * as db from '../../lib/db';
import { ErrorText, Field } from './ui';

export const TeacherLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await db.signIn(username, password);
      // TeacherArea switches screens through onAuthChange.
    } catch {
      setError('Utilizador ou palavra-passe errados.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <div className="label-print">Área reservada</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mt-1">
          Área da Professora
        </h1>
      </div>

      <form onSubmit={submit} className="sketch p-6 space-y-4">
        <Field label="Utilizador">
          <input
            className="field"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field label="Palavra-passe">
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <ErrorText error={error} />
        <button type="submit" className="btn btn-pen" disabled={busy}>
          <LogIn className="w-4 h-4" />
          {busy ? 'A entrar…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};
