import { Search } from 'lucide-react';

import { Button } from './button';
import { Card } from './card';
import { Input } from './input';

export const Header = () => {
  return (
    <Card className="flex h-[90px] w-full items-center justify-center gap-2 rounded-none border-x-0 border-t-0 p-4">
      <Input className="" placeholder="Pesquisar clube, livro ou resenha" />
      <Button
        variant="secondary"
        className="h-[50px] w-[50px] flex-shrink-0 p-0"
      >
        <Search />
      </Button>
    </Card>
  );
};
