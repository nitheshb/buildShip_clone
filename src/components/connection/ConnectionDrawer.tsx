"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ConnectionService } from '@/lib/services/connectionService';
import { fetchMysqlTables, fetchPostgresTables, fetchSupabaseTables, fetchNeonTables, fetchFirestoreCollections } from '@/lib/database/fetch-tables';
import { testFirestoreConnection, testMySQLConnection, testNeonConnection, testPostgreSQLConnection, testSupabaseConnection } from '@/lib/database/test-connection';
import { useMySQLForm, usePostgreSQLForm, useMongoDBForm, useSupabaseForm, usePdfQueryForm, useExcelQueryForm, useFirestoreForm, useNeonForm } from '@/hooks/useConnectionForm';
import { DrawerHeader } from '../common/DrawerHeader';
import { ProgressBar } from '../common/ProgressBar';
import { ConnectionForm } from '../forms/ConnectionForm';
import { TableSelectionForm } from './TableSelectionForm';
import { ColumnDescriptionForm } from './ColumnDescriptionForm';
import { DrawerFooter } from '../common/DrawerFooter';
import { TableInfo } from '@/lib/types';
import { templateData } from '@/app/(main)/(pages)/dashboard/_components/TemplatesSection';
import { cryptoService } from '@/lib/services/cryptoService';

interface ConnectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    templateValue: string;
    connectionId?: string;
}

const ConnectionDrawer: React.FC<ConnectionDrawerProps> = ({ isOpen, onClose, templateValue, connectionId }) => {
    const { user } = useUser();
    const userId = user?.id || '';

    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [columnsDescriptions, setColumnsDescriptions] = useState<Record<string, Record<string, string>>>({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [previousSelectedTables, setPreviousSelectedTables] = useState<string[]>([]);
    const [tableDescriptions, setTableDescriptions] = useState<Record<string, string>>({});

    const mysqlForm = useMySQLForm();
    const postgresqlForm = usePostgreSQLForm();
    const neondbForm = useNeonForm();
    const mongodbForm = useMongoDBForm();
    const supabaseForm = useSupabaseForm();
    const firestoreForm = useFirestoreForm();
    const pdfQueryForm = usePdfQueryForm();
    const excelQueryForm = useExcelQueryForm();

    useEffect(() => {
        const loadConnectionData = async () => {
            if (connectionId && isOpen) {
                setIsLoading(true);
                setIsEditMode(true);

                try {
                    const connection = await ConnectionService.getConnectionById(connectionId);
                    if (connection) {
                        const { connectionDetails, promptHelper } = connection;
                        const currentForm = getCurrentForm();
                        if (currentForm) {
                            const setForm = (form: any, data: Record<string, any>) => {
                                form.setFormData({
                                    connectionName: connection.name,
                                    promptHelper: connection.promptHelper || '',
                                    ...data
                                });
                            };

                            switch (templateValue) {
                                case 'chat_with_mysql':
                                    const decryptedPassword = await cryptoService.decrypt(
                                        connectionDetails.password
                                      );
                                    setForm(mysqlForm, {
                                        host: connectionDetails.host || '',
                                        port: connectionDetails.port || '',
                                        username: connectionDetails.username || '',
                                        password: decryptedPassword || '',
                                        databasename: connectionDetails.database_name || '',
                                    });
                                    break;
                                case 'chat_with_postgresql':
                                    setForm(postgresqlForm, {
                                        databaseUrl: connectionDetails.database_url || '',
                                    });
                                    break;
                                case 'chat_with_neon':
                                    setForm(neondbForm, {
                                        databaseUrl: connectionDetails.database_url || '',
                                    });
                                    break;
                                case 'chat_with_supabase':
                                    setForm(supabaseForm, {
                                        supabaseUrl: connectionDetails.supabase_url || '',
                                        supabaseKey: connectionDetails.supabase_key || '',
                                        databaseUrl: connectionDetails.database_url || '',
                                    });
                                    break;
                                case 'chat_with_firestore':
                                    setForm(firestoreForm, {
                                        clientEmail: connectionDetails.client_email || '',
                                        privateKey: connectionDetails.private_key || '',
                                        projectId: connectionDetails.project_id || '',
                                    });
                                    break;
                                case 'chat_with_mongodb':
                                    setForm(mongodbForm, {
                                        databaseUrl: connectionDetails.database_url || '',
                                        database: connectionDetails.database || '',
                                        username: connectionDetails.username || '',
                                        password: connectionDetails.password || '',
                                    });
                                    break;
                                default:
                                    break;
                            }

                            if (connection.promptHelper) {
                                try {
                                    const parsedPromptHelper = typeof connection.promptHelper === 'string' 
                                        ? JSON.parse(connection.promptHelper) 
                                        : connection.promptHelper;
                                                                        
                                    if (parsedPromptHelper.selectedTables) {
                                        const loadedTables = parsedPromptHelper.selectedTables.map((table: any) => ({
                                            name: table.name,
                                            columns: table.columns.map((col: any) => ({
                                                name: col.name,
                                                description: col.description || ''
                                            }))
                                        }));

                                        const prevSelectedTableNames = loadedTables.map((table: any) => table.name);
                                        setPreviousSelectedTables(prevSelectedTableNames);
                                        setSelectedTables(prevSelectedTableNames);

                                        const descriptions: Record<string, Record<string, string>> = {};
                                        const tableDescs: Record<string, string> = {};
                                        
                                        parsedPromptHelper.selectedTables.forEach((table: any) => {
                                            // Set up the column descriptions
                                            descriptions[table.name] = {};
                                            
                                            // Set table description if available
                                            if (table.description) {
                                                tableDescs[table.name] = table.description;
                                            }
                                            
                                            // Process column descriptions
                                            table.columns.forEach((col: any) => {
                                                descriptions[table.name][col.name] = col.description || '';
                                            });
                                        });
                                        
                                        setColumnsDescriptions(descriptions);
                                        setTableDescriptions(tableDescs);
                                    }
                                } catch (error) {
                                    console.error("Error parsing promptHelper:", error);
                                }
                            }
                        }
                    }
                } catch (error) {
                    toast.error(`Error loading connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsEditMode(false);
                setPreviousSelectedTables([]);
                setTableDescriptions({});
            }
        };

        loadConnectionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionId, isOpen, templateValue]);

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(1);
            setTables([]);
            setSelectedTables([]);
            setColumnsDescriptions({});
            setPreviousSelectedTables([]);
        }
    }, [isOpen]);

    const getCurrentForm = () => {
        switch (templateValue) {
            case 'chat_with_mysql': return mysqlForm;
            case 'chat_with_postgresql': return postgresqlForm;
            case 'chat_with_neon': return neondbForm;
            case 'chat_with_mongodb': return mongodbForm;
            case 'chat_with_supabase': return supabaseForm;
            case 'chat_with_firestore': return firestoreForm;
            case 'chat_with_pdf': return pdfQueryForm;
            case 'chat_with_excel': return excelQueryForm;
            default: return mysqlForm;
        }
    };

    const currentForm = getCurrentForm();

    const handleTestConnection = async () => {
        setIsLoading(true);
        let result;

        try {
            if (templateValue === 'chat_with_mysql') {
                const { host, port, username, password, databasename } = mysqlForm.formData;
                result = await testMySQLConnection({ host, port, username, password, databasename });
            }
            else if (templateValue === 'chat_with_postgresql') {
                const { databaseUrl } = postgresqlForm.formData;
                result = await testPostgreSQLConnection(databaseUrl);
            }
            else if (templateValue === 'chat_with_neon') {
                const { databaseUrl } = neondbForm.formData;
                result = await testNeonConnection(databaseUrl);
            }
            else if (templateValue === 'chat_with_supabase') {
                const { databaseUrl } = supabaseForm.formData;
                result = await testSupabaseConnection(databaseUrl);
            }
            else if (templateValue === 'chat_with_firestore') {
                const { clientEmail, privateKey, projectId } = firestoreForm.formData;
                result = await testFirestoreConnection({ clientEmail, privateKey, projectId });
            }

            if (result?.success) {
                toast.success('Connection successful!');
            } else {
                toast.error(`Connection failed: ${result?.error || 'Unknown error'}`);
            }
        } catch (error) {
            toast.error(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTables = async () => {
        setIsLoading(true);
        try {
            let result;

            if (templateValue === 'chat_with_mysql') {
                const { host, port, username, password, databasename } = mysqlForm.formData;
                result = await fetchMysqlTables({ host, port, username, password, databasename });

                if (result && result.success) {
                    const tableData = result.tables.map((table: any) => ({
                        name: table.name,
                        columns: table.columns.map((col: any) => ({
                            name: col,
                            description: ''
                        }))
                    }));
                    setTables(tableData);
                } else {
                    toast.error(`Failed to fetch tables: ${result.error || 'Unknown error'}`);
                    return false;
                }
            }
            if (templateValue === 'chat_with_postgresql') {
                const { databaseUrl } = postgresqlForm.formData;
                result = await fetchPostgresTables(databaseUrl);

                if (result && result.success) {
                    const tableData = result.tables.map((table: any) => ({
                        name: table.name,
                        columns: table.columns.map((col: any) => ({
                            name: col,
                            description: ''
                        }))
                    }));
                    setTables(tableData);
                } else {
                    toast.error(`Failed to fetch tables: ${result.error || 'Unknown error'}`);
                    return false;
                }
            }
            if (templateValue === 'chat_with_neon') {
                const { databaseUrl } = neondbForm.formData;
                result = await fetchNeonTables(databaseUrl);

                if (result && result.success) {
                    const tableData = result.tables.map((table: any) => ({
                        name: table.name,
                        columns: table.columns.map((col: any) => ({
                            name: col,
                            description: ''
                        }))
                    }));
                    setTables(tableData);
                } else {
                    toast.error(`Failed to fetch tables: ${result.error || 'Unknown error'}`);
                    return false;
                }
            }
            if (templateValue === 'chat_with_supabase') {
                const { supabaseUrl, supabaseKey, databaseUrl } = supabaseForm.formData;
                result = await fetchSupabaseTables({ supabaseUrl, supabaseKey, databaseUrl });

                if (result && result.success) {
                    const tableData = result.tables.map((table: any) => ({
                        name: table.name,
                        columns: table.columns.map((col: any) => ({
                            name: col,
                            description: ''
                        }))
                    }));
                    setTables(tableData);
                } else {
                    toast.error(`Failed to fetch tables: ${result.error || 'Unknown error'}`);
                    return false;
                }
            }
            if (templateValue === 'chat_with_firestore') {
                const { clientEmail, privateKey, projectId } = firestoreForm.formData;
                result = await fetchFirestoreCollections({ clientEmail, privateKey, projectId });

                if (result && result.success) {
                    const tableData = result.tables.map((table: any) => ({
                        name: table.name,
                        columns: table.columns.map((col: any) => ({
                            name: col,
                            description: ''
                        }))
                    }));
                    setTables(tableData);
                } else {
                    toast.error(`Failed to fetch tables: ${result.error || 'Unknown error'}`);
                    return false;
                }
            }
            if (isEditMode && previousSelectedTables.length > 0) {
                setSelectedTables(previousSelectedTables);
            }

            return true;
        } catch (error) {
            toast.error(`Error fetching tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextStep = async () => {
        if (currentStep === 1) {

            const success = await fetchTables();
            if (success) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            if (selectedTables.length === 0) {
                toast.error('Please select at least one table');
                return;
            }

            const initialDescriptions: Record<string, Record<string, string>> = {};
            selectedTables.forEach(tableName => {
                const table = tables.find(t => t.name === tableName);
                if (table) {
                    initialDescriptions[tableName] = {};
                    table.columns.forEach(column => {
                        initialDescriptions[tableName][column.name] =
                            columnsDescriptions[tableName]?.[column.name] || column.description;
                    });
                }
            });

            setColumnsDescriptions(initialDescriptions);
            setCurrentStep(3);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleTableSelection = (tableName: string) => {
        setSelectedTables(prev => {
            if (prev.includes(tableName)) {
                return prev.filter(t => t !== tableName);
            } else {
                return [...prev, tableName];
            }
        });
    };

    const handleColumnDescriptionChange = (tableName: string, columnName: string, description: string) => {
        setColumnsDescriptions(prev => ({
            ...prev,
            [tableName]: {
                ...prev[tableName],
                [columnName]: description
            }
        }));
    };

    const handleTableDescriptionChange = (tableName: string, description: string) => {
        setTableDescriptions(prev => ({
            ...prev,
            [tableName]: description
        }));
    };

    const generatePromptHelper = (selectedTables: string[], tables: TableInfo[], columnsDescriptions: Record<string, Record<string, string>>, tableDescriptions: Record<string, string>) => {
        return {
            selectedTables: selectedTables.map(tableName => {
                const table = tables.find(t => t.name === tableName);
                return {
                    name: tableName,
                    description: tableDescriptions[tableName] || '',
                    columns: table?.columns.map(column => ({
                        name: column.name,
                        description: columnsDescriptions[tableName]?.[column.name] || ''
                    })) || []
                };
            })
        };
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
    
        if (currentStep !== 3) {
            handleNextStep();
            return;
        }
    
        if (!userId) {
            currentForm.error = "User not authenticated. Please sign in.";
            toast.error("User not authenticated. Please sign in.");
            return;
        }
    
        if (!currentForm.formData.connectionName) {
            toast.error('Connection name is required');
            return;
        }
    
        setIsLoading(true);
        try {
            const promptHelper = generatePromptHelper(selectedTables, tables, columnsDescriptions, tableDescriptions);
            const promptHelperString = JSON.stringify(promptHelper);
    
            if (isEditMode && connectionId) {
                let updatedData;
                
                switch (templateValue) {
                    case 'chat_with_mysql':
                        updatedData = { 
                            ...mysqlForm.formData,
                            promptHelper: promptHelperString 
                        };
                        break;
                    case 'chat_with_postgresql':
                        updatedData = { 
                            ...postgresqlForm.formData,
                            promptHelper: promptHelperString 
                        };
                        break;
                    case 'chat_with_neon':
                        updatedData = { 
                            ...neondbForm.formData,
                            promptHelper: promptHelperString 
                        };
                        break;
                    case 'chat_with_supabase':
                        updatedData = { 
                            ...supabaseForm.formData,
                            promptHelper: promptHelperString 
                        };
                        break;
                    case 'chat_with_firestore':
                        updatedData = { 
                            ...firestoreForm.formData,
                            promptHelper: promptHelperString 
                        };
                        break;
                    case 'chat_with_mongodb':
                        updatedData = { 
                            ...mongodbForm.formData,
                            promptHelper: promptHelperString 
                        };
                        break;
                    default:
                        throw new Error('Unsupported template type');
                }
                
                const result = await ConnectionService.updateConnection(connectionId, updatedData, templateValue, userId);
                
                if (result.success) {
                    currentForm.resetForm();
                    setCurrentStep(1);
                    setSelectedTables([]);
                    setColumnsDescriptions({});
                    onClose();
                    toast.success('Connection updated successfully!');
                } else {
                    throw new Error(result.error || 'Failed to update connection');
                }
            } else {                
                switch (templateValue) {
                    case 'chat_with_mysql':
                        mysqlForm.formData.promptHelper = promptHelperString;
                        break;
                    case 'chat_with_postgresql':
                        postgresqlForm.formData.promptHelper = promptHelperString;
                        break;
                    case 'chat_with_neon':
                        neondbForm.formData.promptHelper = promptHelperString;
                        break;
                    case 'chat_with_supabase':
                        supabaseForm.formData.promptHelper = promptHelperString;
                        break;
                    case 'chat_with_firestore':
                        firestoreForm.formData.promptHelper = promptHelperString;
                        break;
                    case 'chat_with_mongodb':
                        mongodbForm.formData.promptHelper = promptHelperString;
                        break;
                    default:
                        throw new Error('Unsupported template type');
                }                                
                const connectionNameExists = await ConnectionService.checkConnectionNameExists(currentForm.formData.connectionName);
                if (connectionNameExists) {
                    throw new Error('Connection name already exists! Please choose a different name.');
                }
                
                const result = await currentForm.handleSubmit(userId);
                
                if (result.success) {
                    currentForm.resetForm();
                    setCurrentStep(1);
                    setSelectedTables([]);
                    setColumnsDescriptions({});
                    onClose();
                    toast.success('Connection saved successfully!');
                } else {
                    throw new Error(result.error || 'Failed to save connection');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!userId) {
            currentForm.error = "User not authenticated. Please sign in.";
            toast.error("User not authenticated. Please sign in.");
            return;
        }

        const result = await currentForm.handleSubmit(userId);
        if (result.success) {
            currentForm.resetForm();
            onClose();
        }
    };

    const getTemplateTitle = (value: string) => {
        const template = templateData.find(t => t.value === value);
        return template ? template.title : "Unknown Template";
    };

    const getStepTitle = () => {
        const templateTitle = getTemplateTitle(templateValue);
        const mode = isEditMode ? "Edit Connection to" : "Connection to";
            return `${mode} ${templateTitle}`;
    };

    const isFileUpload = templateValue === 'chat_with_pdf' || templateValue === 'chat_with_excel';

    return (
        <div className={`fixed inset-y-0 right-0 w-[500px] bg-background shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <DrawerHeader title={getStepTitle()} onClose={onClose} />

                {!isFileUpload && <ProgressBar currentStep={currentStep} />}

                <div className="p-6 flex-grow overflow-y-auto">
                    <form className="space-y-4">
                        {currentStep === 1 && (
                            <ConnectionForm
                                templateValue={templateValue}
                                currentForm={currentForm}
                                isLoading={isLoading}
                                onTestConnection={handleTestConnection}
                            />
                        )}

                        {currentStep === 2 && !isFileUpload && (
                            <TableSelectionForm
                                tables={tables}
                                selectedTables={selectedTables}
                                onTableSelection={handleTableSelection}
                            />
                        )}

                        {currentStep === 3 && !isFileUpload && (
                            <ColumnDescriptionForm
                                selectedTables={selectedTables}
                                tables={tables}
                                columnsDescriptions={columnsDescriptions}
                                onColumnDescriptionChange={handleColumnDescriptionChange}
                                tableDescriptions={tableDescriptions}
                                onTableDescriptionChange={handleTableDescriptionChange}
                            />
                        )}

                        {currentForm.error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-md">
                                {currentForm.error}
                            </div>
                        )}
                    </form>
                </div>

                <DrawerFooter
                    currentStep={currentStep}
                    isFileUpload={isFileUpload}
                    isLoading={isLoading}
                    onCancel={() => {
                        currentForm.resetForm();
                        onClose();
                    }}
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    onSubmit={handleSubmit}
                    onFileSubmit={handleFileSubmit}
                    selectedTablesCount={selectedTables.length}
                    isEditMode={isEditMode}
                />
            </div>
        </div>
    );
};

export default ConnectionDrawer;