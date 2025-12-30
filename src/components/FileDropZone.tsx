import { useCallback, useState } from 'react';
import { Upload, FileText, Image, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  accept: string;
  label: string;
  description: string;
  icon: 'xmp' | 'image';
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  files?: File[];
  onRemoveFile?: (index: number) => void;
}

export function FileDropZone({
  accept,
  label,
  description,
  icon,
  onFilesSelected,
  multiple = false,
  files = [],
  onRemoveFile,
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        onFilesSelected(multiple ? droppedFiles : [droppedFiles[0]]);
      }
    },
    [onFilesSelected, multiple]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        onFilesSelected(selectedFiles);
      }
      e.target.value = '';
    },
    [onFilesSelected]
  );

  const IconComponent = icon === 'xmp' ? FileText : Image;

  return (
    <div className="space-y-2">
      <label
        className={cn(
          'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors',
          isDragOver ? 'bg-primary/20' : 'bg-secondary'
        )}>
          {isDragOver ? (
            <Upload className="w-5 h-5 text-primary" />
          ) : (
            <IconComponent className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        
        <span className="text-sm font-medium mb-1">{label}</span>
        <span className="text-xs text-muted-foreground text-center">{description}</span>
      </label>

      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md group"
            >
              <IconComponent className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-mono text-foreground truncate flex-1">
                {file.name}
              </span>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {(file.size / 1024).toFixed(1)}KB
              </span>
              {onRemoveFile && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveFile(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
