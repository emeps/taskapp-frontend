import {
  Card,
  CardContent
} from "@/components/ui/card";
import Lottie from "lottie-react";
import loadingPageAnimation from "../assets/animations/loading.json";
export const Loading = () => {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-2xl p-6 border-none shadow-none">
          <CardContent className="flex items-center justify-center">
            <Lottie animationData={loadingPageAnimation} loop={true} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
