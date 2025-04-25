import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface TemplateCardProps {
  title: string;
  value: string;
  description: string;
  icons: string[];
  className?: string;
  onConnect: (templateValue: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  title, 
  value,
  description, 
  icons, 
  className,
  onConnect
}) => {
  return (
    <div className={cn("bg-card rounded-lg p-6 card-hover border border-border h-full flex flex-col shadow-lg", className)}>
      <div className="flex gap-2 mb-4 justify-between items-center">
        <div className="flex flex-row">
          {icons.map((icon, i) => (
            <div key={i} className="dark:bg-white rounded-md p-1  mr-1 flex items-center justify-center">
              <Image 
                src={icon} 
                alt={`icon-${i}`} 
                width={32} 
                height={32} 
              />
            </div>
          ))}
        </div>
        <div>
          <Button onClick={() => onConnect(value)}>
            Connect
          </Button>
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-2 flex-grow">{description}</p>
    </div>
  );
};

export default TemplateCard;
