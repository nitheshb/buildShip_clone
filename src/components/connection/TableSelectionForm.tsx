import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TableInfo } from '@/lib/types';

interface TableSelectionFormProps {
    tables: TableInfo[];
    selectedTables: string[];
    onTableSelection: (tableName: string) => void;
}

export const TableSelectionForm: React.FC<TableSelectionFormProps> = ({ 
    tables, 
    selectedTables, 
    onTableSelection 
}) => {
    const allTablesSelected = tables.length > 0 && selectedTables.length === tables.length;
    
    const handleSelectAll = () => {
        if (allTablesSelected) {
            tables.forEach(table => {
                if (selectedTables.includes(table.name)) {
                    onTableSelection(table.name);
                }
            });
        } else {
            tables.forEach(table => {
                if (!selectedTables.includes(table.name)) {
                    onTableSelection(table.name);
                }
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-4">Select the tables you want to include:</p>
                {tables.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        <div className="flex items-center space-x-2 p-2 rounded-md mb-2">
                            <div
                                className="cursor-pointer"
                                onClick={handleSelectAll}
                            >
                                {allTablesSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                            </div>
                            <Label 
                                className="cursor-pointer font-medium" 
                                onClick={handleSelectAll}
                            >
                                Select All Tables ({tables.length})
                            </Label>
                        </div>
                        
                        <Separator className="my-2"/>

                        {tables.map((table) => (
                            <div key={table.name} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => onTableSelection(table.name)}
                                >
                                    {selectedTables.includes(table.name) ? <CheckSquare size={20} /> : <Square size={20} />}
                                </div>
                                <Label 
                                    htmlFor={`table-${table.name}`} 
                                    className="cursor-pointer" 
                                    onClick={() => onTableSelection(table.name)}
                                >
                                    {table.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No tables found</p>
                )}
            </div>
        </div>
    );
};