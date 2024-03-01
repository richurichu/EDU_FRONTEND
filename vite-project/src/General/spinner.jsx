import { Button, Spinner } from 'flowbite-react';

export default function Buttons() {
  return (
    <>
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Button>
        <Spinner
          aria-label="Spinner button example"
          size="sm"
        />
        <span className="pl-3">
          Loading...
        </span>
      </Button>
      </div>
      
    </>
  )
}