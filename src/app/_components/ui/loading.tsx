import { GridLoader } from 'react-spinners';

export const Loading = () => {
  return (
    <div className="fixed z-10 flex h-screen w-screen items-center justify-center opacity-100">
      <GridLoader color="white" size={10} />
    </div>
  );
};
