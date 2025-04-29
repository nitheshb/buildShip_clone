import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface ConnectionFormProps {
    templateValue: string;
    currentForm: any;
    isLoading: boolean;
    onTestConnection: () => Promise<void>;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ 
    templateValue, 
    currentForm, 
    isLoading, 
    onTestConnection 
}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
      };
    
    switch (templateValue) {
        case 'chat_with_mysql':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="connectionName">Connection Name</Label>
                        <Input
                            id="connectionName"
                            placeholder="Connection Name"
                            className="mt-1"
                            value={currentForm.formData.connectionName}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="host">Host</Label>
                        <Input
                            id="host"
                            placeholder="localhost"
                            className="mt-1"
                            value={currentForm.formData.host}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="port">Port</Label>
                        <Input
                            id="port"
                            placeholder="3306"
                            className="mt-1"
                            value={currentForm.formData.port}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="username"
                            className="mt-1"
                            value={currentForm.formData.username}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
              <Input
                id="password"
                type={passwordVisible ? 'text' : 'password'} // Toggle between password and text
                placeholder="••••••••"
                className="mt-1"
                value={currentForm.formData.password}
                onChange={currentForm.handleInputChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="databasename">Database Name</Label>
                        <Input
                            id="databasename"
                            placeholder="databasename"
                            className="mt-1"
                            value={currentForm.formData.databasename}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Button
                            type="button"
                            onClick={onTestConnection}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Testing...' : 'Test Connection'}
                        </Button>
                    </div>
                </>
            );
        case 'chat_with_postgresql':
        case 'chat_with_neon':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="connectionName">Connection Name</Label>
                        <Input
                            id="connectionName"
                            placeholder="Connection Name"
                            className="mt-1"
                            value={currentForm.formData.connectionName}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="databaseUrl">Database URL</Label>
                        <Input
                            id="databaseUrl"
                            placeholder="databaseUrl"
                            className="mt-1"
                            value={currentForm.formData.databaseUrl}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Button
                            type="button"
                            onClick={onTestConnection}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Testing...' : 'Test Connection'}
                        </Button>
                    </div>
                </>
            );
        case 'chat_with_mongodb':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="connectionName">Connection Name</Label>
                        <Input
                            id="connectionName"
                            placeholder="Connection Name"
                            className="mt-1"
                            value={currentForm.formData.connectionName}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="databaseUrl">Connection URL</Label>
                        <Input
                            id="databaseUrl"
                            placeholder="mongodb://localhost:27017"
                            className="mt-1"
                            value={currentForm.formData.databaseUrl}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Button
                            type="button"
                            onClick={onTestConnection}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Testing...' : 'Test Connection'}
                        </Button>
                    </div>
                </>
            );
        case 'chat_with_supabase':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="connectionName">Connection Name</Label>
                        <Input
                            id="connectionName"
                            placeholder="Connection Name"
                            className="mt-1"
                            value={currentForm.formData.connectionName}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="supabaseUrl">Supabase URL</Label>
                        <Input
                            id="supabaseUrl"
                            placeholder="https://your-project.supabase.co"
                            className="mt-1"
                            value={currentForm.formData.supabaseUrl}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="supabaseKey">Supabase API Key</Label>
                        <Input
                            id="supabaseKey"
                            placeholder="your-api-key"
                            className="mt-1"
                            value={currentForm.formData.supabaseKey}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="databaseUrl">Supabase Connection URL</Label>
                        <Input
                            id="databaseUrl"
                            placeholder="databaseUrl"
                            className="mt-1"
                            value={currentForm.formData.databaseUrl}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Button
                            type="button"
                            onClick={onTestConnection}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Testing...' : 'Test Connection'}
                        </Button>
                    </div>
                </>
            );
        case 'chat_with_firestore':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="connectionName">Connection Name</Label>
                        <Input
                            id="connectionName"
                            placeholder="Connection Name"
                            className="mt-1"
                            value={currentForm.formData.connectionName}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="clientEmail">Client Email</Label>
                        <Input
                            id="clientEmail"
                            placeholder="Your Client Email"
                            className="mt-1"
                            value={currentForm.formData.clientEmail}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="privateKey">Private Key</Label>
                        <Input
                            id="privateKey"
                            placeholder="Your Private Key"
                            className="mt-1"
                            value={currentForm.formData.privateKey}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="projectId">Project ID</Label>
                        <Input
                            id="projectId"
                            placeholder="Your Project Id"
                            className="mt-1"
                            value={currentForm.formData.projectId}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Button
                            type="button"
                            onClick={onTestConnection}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Testing...' : 'Test Connection'}
                        </Button>
                    </div>
                </>
            );
        case 'chat_with_pdf':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="fileUpload">Upload PDF File</Label>
                        <Input
                            id="fileUpload"
                            type="file"
                            accept=".pdf"
                            className="mt-1"
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                </>
            );
        case 'chat_with_excel':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="fileUpload">Upload Excel File</Label>
                        <Input
                            id="fileUpload"
                            type="file"
                            accept=".xlsx,.xls"
                            className="mt-1"
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                </>
            );
            case 'chat_with_image':
            return (
                <>
                    <div className="mb-4">
                        <Label htmlFor="fileUpload">Upload an Image</Label>
                        <Input
                            id="fileUpload"
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            className="mt-1"
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                </>
            );
        default:
            return (
                <div className="mb-4">
                    <p>Connection details for {templateValue}</p>
                </div>
            );
    }
};