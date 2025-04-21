import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ConnectionFormProps {
    templateTitle: string;
    currentForm: any;
    isLoading: boolean;
    onTestConnection: () => Promise<void>;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ 
    templateTitle, 
    currentForm, 
    isLoading, 
    onTestConnection 
}) => {
    
    switch (templateTitle) {
        case 'MySQL':
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
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1"
                            value={currentForm.formData.password}
                            onChange={currentForm.handleInputChange}
                        />
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
        case 'PostgreSQL':
        case 'Neon':
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
                            placeholder="postgresql://user:password@host:port/database"
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
        case 'MongoDB':
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
                        <Label htmlFor="connectionString">Connection String</Label>
                        <Input
                            id="connectionString"
                            placeholder="mongodb://localhost:27017"
                            className="mt-1"
                            value={currentForm.formData.connectionString}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="database">Database Name</Label>
                        <Input
                            id="database"
                            placeholder="my_database"
                            className="mt-1"
                            value={currentForm.formData.database}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="username">Username (Optional)</Label>
                        <Input
                            id="username"
                            placeholder="username"
                            className="mt-1"
                            value={currentForm.formData.username}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password">Password (Optional)</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1"
                            value={currentForm.formData.password}
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
        case 'Supabase':
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
        case 'Firebase':
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
                            placeholder="your-client-email"
                            className="mt-1"
                            value={currentForm.formData.clientEmail}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="privateKeyId">Private Key Id</Label>
                        <Input
                            id="privateKeyId"
                            placeholder="your-private-key-id"
                            className="mt-1"
                            value={currentForm.formData.privateKeyId}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="privateKey">Private Key</Label>
                        <Input
                            id="privateKey"
                            placeholder="your-private-key"
                            className="mt-1"
                            value={currentForm.formData.privateKey}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="projectId">Project ID</Label>
                        <Input
                            id="projectId"
                            placeholder="your-project-id"
                            className="mt-1"
                            value={currentForm.formData.projectId}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="clientId">Client ID</Label>
                        <Input
                            id="clientId"
                            placeholder="your-client-id"
                            className="mt-1"
                            value={currentForm.formData.clientId}
                            onChange={currentForm.handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="clientUrl">Client URL</Label>
                        <Input
                            id="clientUrl"
                            placeholder="your-client-url"
                            className="mt-1"
                            value={currentForm.formData.clientUrl}
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
        case 'PdfQuery':
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
        case 'ExcelQuery':
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
        default:
            return (
                <div className="mb-4">
                    <p>Connection details for {templateTitle}</p>
                </div>
            );
    }
};