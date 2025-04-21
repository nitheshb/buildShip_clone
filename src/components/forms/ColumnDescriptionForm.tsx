import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TableInfo {
    name: string;
    columns: {
        name: string;
        description: string;
    }[];
}

interface ColumnDescriptionFormProps {
    selectedTables: string[];
    tables: TableInfo[];
    columnsDescriptions: Record<string, Record<string, string>>;
    onColumnDescriptionChange: (tableName: string, columnName: string, description: string) => void;
}

export const ColumnDescriptionForm: React.FC<ColumnDescriptionFormProps> = ({ 
    selectedTables, 
    tables, 
    columnsDescriptions, 
    onColumnDescriptionChange 
}) => {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
                Add descriptions for the columns in your selected tables:
            </p>
            <div className="space-y-6 max-h-[400px] overflow-y-auto">
                {selectedTables.map((tableName) => {
                    const table = tables.find(t => t.name === tableName);
                    if (!table) return null;

                    return (
                        <div key={tableName} className="border rounded-md p-4">
                            <h3 className="font-medium mb-3">{tableName}</h3>
                            <div className="space-y-3">
                                {table.columns.map((column) => (
                                    <div key={`${tableName}-${column.name}`} className="grid grid-cols-3 gap-4 items-center">
                                        <Label htmlFor={`${tableName}-${column.name}`} className="col-span-1">
                                            {column.name}
                                        </Label>
                                        <Input
                                            id={`${tableName}-${column.name}`}
                                            placeholder="Column description"
                                            className="col-span-2"
                                            value={columnsDescriptions[tableName]?.[column.name] || ''}
                                            onChange={(e) => onColumnDescriptionChange(tableName, column.name, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };