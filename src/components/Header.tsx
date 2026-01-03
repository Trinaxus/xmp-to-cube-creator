import { Boxes, Github } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Boxes className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight">xmp to cube creator</span>
            <span className="text-[10px] text-muted-foreground font-mono">XMP → .CUBE</span>
          </div>
        </div>
        <div className="h-6 w-px bg-border mx-2" />
        <span className="text-xs text-muted-foreground">
          Image-based LUT sampling
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
          v1.0.0
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Github className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
