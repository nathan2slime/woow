import { AppChildren } from '~/types';

const AuthLayout = async ({ children }: AppChildren) => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden">
      {children}

      <div className="w-full" />
    </div>
  );
};

export default AuthLayout;
