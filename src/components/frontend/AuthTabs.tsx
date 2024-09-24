import React, { useState } from 'react';
import { useBackend } from '../../contexts/BackendContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';

const AuthTabs: React.FC = () => {
  const { login, register } = useBackend();
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = async () => {
    const result = await login(loginEmail, loginPassword);
    if (result) {
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async () => {
    const result = await register(registerName, registerEmail, registerPassword);
    if (result) {
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } else {
      alert('Registration failed. Email might already be in use.');
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            <Button onClick={handleLogin}>Login</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
            <Input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
            <Button onClick={handleRegister}>Register</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;