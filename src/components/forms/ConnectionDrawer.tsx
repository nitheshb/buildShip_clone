"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ConnectionService } from '@/lib/connectionService';
import { fetchMysqlTables } from '@/lib/fetch-tables';
import { testMySQLConnection, testPostgreSQLConnection } from '@/lib/test-connection';
import {
    useMySQLForm,
    usePostgreSQLForm,
    useMongoDBForm,
    useSupabaseForm,
    useFirebaseForm,
    usePdfQueryForm,
    useExcelQueryForm
} from '@/hooks/useConnectionForm';
import { DrawerHeader } from './DrawerHeader';
import { ProgressBar } from './ProgressBar';
import { ConnectionForm } from './ConnectionForm';
import { TableSelectionForm } from './TableSelectionForm';
import { ColumnDescriptionForm } from './ColumnDescriptionForm';
import { DrawerFooter } from './DrawerFooter';
import { TableInfo } from '@/lib/types';

interface ConnectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    templateTitle: string;
}

const ConnectionDrawer: React.FC<ConnectionDrawerProps> = ({ isOpen, onClose, templateTitle }) => {
    const { user } = useUser();
    const userId = user?.id || '';

    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [columnsDescriptions, setColumnsDescriptions] = useState<Record<string, Record<string, string>>>({});

    const mysqlForm = useMySQLForm();
    const postgresqlForm = usePostgreSQLForm();
    const mongodbForm = useMongoDBForm();
    const supabaseForm = useSupabaseForm();
    const firebaseForm = useFirebaseForm();
    const pdfQueryForm = usePdfQueryForm();
    const excelQueryForm = useExcelQueryForm();

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(1);
            setTables([]);
            setSelectedTables([]);
            setColumnsDescriptions({});
        }
    }, [isOpen]);

    const getCurrentForm = () => {
        switch (templateTitle) {
            case 'MySQL': return mysqlForm;
            case 'PostgreSQL':
            case 'Neon': return postgresqlForm;
            case 'MongoDB': return mongodbForm;
            case 'Supabase': return supabaseForm;
            case 'Firebase': return firebaseForm;
            case 'PdfQuery': return pdfQueryForm;
            case 'ExcelQuery': return excelQueryForm;
            default: return mysqlForm;
        }
    };

    const currentForm = getCurrentForm();

    const handleTestConnection = async () => {
        setIsLoading(true);
        let result;

        try {
            if (templateTitle === 'MySQL') {
                const { host, port, username, password, databasename } = mysqlForm.formData;
                result = await testMySQLConnection({ host, port, username, password, databasename });
            } else if (templateTitle === 'PostgreSQL') {
                const { databaseUrl } = postgresqlForm.formData;
                result = await testPostgreSQLConnection(databaseUrl);
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

            if (templateTitle === 'MySQL') {
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
            // Add similar implementations for PostgreSQL and other databases

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

            // Initialize descriptions for selected tables
            const initialDescriptions: Record<string, Record<string, string>> = {};
            selectedTables.forEach(tableName => {
                const table = tables.find(t => t.name === tableName);
                if (table) {
                    initialDescriptions[tableName] = {};
                    table.columns.forEach(column => {
                        initialDescriptions[tableName][column.name] = column.description;
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

        const connectionNameExists = await ConnectionService.checkConnectionNameExists(mysqlForm.formData.connectionName);
        if (connectionNameExists) {
            toast.error('Connection name already exists! Please choose a different name.');
            return;
        }
        setIsLoading(true);
        try {
            // Prepare the prompt_helper JSON data
            const promptHelper = {
                selectedTables: selectedTables.map(tableName => {
                    const table = tables.find(t => t.name === tableName);
                    return {
                        name: tableName,
                        columns: table?.columns.map(column => ({
                            name: column.name,
                            description: columnsDescriptions[tableName]?.[column.name] || ''
                        })) || []
                    };
                })
            };

            // Add the prompt_helper to the form data
            if (templateTitle === 'MySQL') {
                mysqlForm.setFormData(prev => ({
                    ...prev,
                    promptHelper: JSON.stringify(promptHelper)
                }));
            }
            // Add similar code for other database types

            const result = await currentForm.handleSubmit(userId);
            if (result.success) {
                currentForm.resetForm();
                setCurrentStep(1);
                setSelectedTables([]);
                setColumnsDescriptions({});
                onClose();
                toast.success('Connection saved successfully!');
            } else {
                toast.error(`Failed to save connection: ${result.error}`);
            }
        } catch (error) {
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

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return `Connection to ${templateTitle}`;
            case 2: return "Select Tables";
            case 3: return "Column Descriptions";
            default: return "Connect to Database";
        }
    };

    const isFileUpload = templateTitle === 'PdfQuery' || templateTitle === 'ExcelQuery';

    return (
        <div className={`fixed inset-y-0 right-0 w-[500px] bg-background shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <DrawerHeader title={getStepTitle()} onClose={onClose} />

                {!isFileUpload && <ProgressBar currentStep={currentStep} />}

                <div className="p-6 flex-grow overflow-y-auto">
                    <form className="space-y-4">
                        {currentStep === 1 && (
                            <ConnectionForm 
                                templateTitle={templateTitle} 
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
                />
            </div>
        </div>
    );
};

export default ConnectionDrawer;