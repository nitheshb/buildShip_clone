import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { generateColumnDescriptions } from '@/lib/database/generate-descriptions';
import { TableInfo } from '@/lib/types';


interface ColumnDescriptionFormProps {
    selectedTables: string[];
    tables: TableInfo[];
    columnsDescriptions: Record<string, Record<string, string>>;
    onColumnDescriptionChange: (tableName: string, columnName: string, description: string) => void;
    tableDescriptions: Record<string, string>;
    onTableDescriptionChange: (tableName: string, description: string) => void;
}

const prepareTablesForDescriptionGeneration = (
  selectedTables: string[],
  tables: TableInfo[]
): Array<{name: string, columns: string[]}> => {
  return selectedTables.map(tableName => {
    const table = tables.find(t => t.name === tableName);
    return {
      name: tableName,
      columns: table?.columns.map(c => c.name) || []
    };
  });
};

export const ColumnDescriptionForm: React.FC<ColumnDescriptionFormProps> = ({ 
    selectedTables, 
    tables, 
    columnsDescriptions, 
    onColumnDescriptionChange,
    tableDescriptions,
    onTableDescriptionChange
}) => {
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);
    const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>(
        selectedTables.reduce((acc, tableName) => ({...acc, [tableName]: true}), {})
    );
    const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>(
        selectedTables.reduce((acc, tableName) => ({...acc, [tableName]: true}), {})
    );

    const toggleTableExpansion = (tableName: string) => {
        setExpandedTables(prev => ({
            ...prev,
            [tableName]: !prev[tableName]
        }));
    };
    
    const toggleColumnsExpansion = (tableName: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the table toggle
        setExpandedColumns(prev => ({
            ...prev,
            [tableName]: !prev[tableName]
        }));
    };

    const generateDescriptionsForAllTables = async (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        setIsGeneratingAll(true);
        try {
            const tableData = prepareTablesForDescriptionGeneration(selectedTables, tables);
            
            const result = await generateColumnDescriptions(tableData);
            
            if (result.success && result.descriptions) {
                Object.entries(result.descriptions as Record<string, Record<string, string>>).forEach(([tableName, tableDescriptions]) => {
                    if (tableDescriptions.__table_description) {
                        onTableDescriptionChange(tableName, tableDescriptions.__table_description as string);
                        delete tableDescriptions.__table_description;
                    }
                    
                    Object.entries(tableDescriptions).forEach(([columnName, description]) => {
                        onColumnDescriptionChange(tableName, columnName, description as string);
                    });
                });
                
                toast.success('Descriptions generated successfully');
            } else {
                throw new Error(result.error || 'Failed to generate descriptions');
            }
        } catch (error) {
            console.error('Error generating descriptions:', error);
            toast.error('Failed to generate descriptions. Please try again.');
        } finally {
            setIsGeneratingAll(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                    Add descriptions for your selected tables and columns:
                </p>
                <Button 
                    variant="outline" 
                    size="sm"
                    type="button" 
                    onClick={generateDescriptionsForAllTables}
                    disabled={isGeneratingAll || selectedTables.length === 0}
                >
                    <Wand2 className={`h-4 w-4 mr-2 ${isGeneratingAll ? 'animate-spin' : ''}`} />
                    {isGeneratingAll ? 'Generating...' : 'Auto-generate all'}
                </Button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {selectedTables.map((tableName) => {
                    const table = tables.find(t => t.name === tableName);
                    if (!table) return null;

                    return (
                        <div key={tableName} className="space-y-2">
                            <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleTableExpansion(tableName)}
                            >
                                <h3 className="font-semibold text-xl">{tableName}</h3>
                                {expandedTables[tableName] ? (
                                    <ChevronUp className="ml-2" size={18} />
                                ) : (
                                    <ChevronDown className="ml-2" size={18} />
                                )}
                            </div>
                            
                            {expandedTables[tableName] && (
                                <div className="border rounded-md p-4">
                                    {/* Table description */}
                                    <div className="mb-4">
                                        <div className="grid grid-cols-3 gap-4 items-center">
                                            <Label htmlFor={`table-desc-${tableName}`} className="col-span-1">
                                                Description
                                            </Label>
                                            <Input
                                                id={`table-desc-${tableName}`}
                                                placeholder="Describe the purpose of this table"
                                                className="col-span-2"
                                                value={tableDescriptions[tableName] || ''}
                                                onChange={(e) => onTableDescriptionChange(tableName, e.target.value)}
                                                disabled={isGeneratingAll}
                                            />
                                        </div>
                                    </div>
                            
                                    <div className="mt-4">
                                        <div 
                                            className="flex items-center justify-between cursor-pointer mb-3"
                                            onClick={(e) => toggleColumnsExpansion(tableName, e)}
                                        >
                                            <Label className="text-md font-semibold">Column Descriptions</Label>
                                            {expandedColumns[tableName] ? (
                                                <ChevronUp className="ml-2" size={16} />
                                            ) : (
                                                <ChevronDown className="ml-2" size={16} />
                                            )}
                                        </div>
                                        
                                        {expandedColumns[tableName] && (
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
                                                            disabled={isGeneratingAll}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};