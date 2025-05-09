import { Button, Tooltip } from "flowbite-react";

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Tooltip
        content={
          <>
            <p>hi</p>
          </>
        }
        style={
          {
            //background: tierColor[champion.tier],
          }
        }
      >
        <Button>Default tooltip</Button>
      </Tooltip>
    </div>
  );
}
