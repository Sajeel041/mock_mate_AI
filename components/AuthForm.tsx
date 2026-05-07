"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative lg:min-w-[480px] perspective-1500"
    >
      {/* outer glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-200/25 via-transparent to-primary-200/25 blur-2xl opacity-70 -z-10" />

      <div className="animated-border p-[1.5px]">
        <div className="rounded-[calc(1rem-2px)] glass px-10 py-12 flex flex-col gap-6 relative overflow-hidden">
          {/* corner glows */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-200/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#6d6dfb]/20 blur-3xl rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-row gap-2 justify-center items-center relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-200/40 blur-xl rounded-full" />
              <Image
                src="/logo.svg"
                alt="logo"
                height={32}
                width={38}
                className="relative animate-float"
              />
            </div>
            <h2 className="text-gradient">MockMate</h2>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-center text-light-100/85 text-xl font-medium"
          >
            {isSignIn
              ? "Welcome back — let's keep practicing."
              : "Practice job interviews with AI"}
          </motion.h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5 mt-2 form relative"
            >
              {!isSignIn && (
                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                  <FormField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Your Name"
                    type="text"
                  />
                </motion.div>
              )}

              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Your email address"
                  type="email"
                />
              </motion.div>

              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <FormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
              </motion.div>

              <motion.div
                custom={3}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <Button
                  className="btn group relative overflow-hidden hover:glow-primary transition-all duration-300"
                  type="submit"
                >
                  <span className="relative z-10">
                    {isSignIn ? "Sign In" : "Create an Account"}
                  </span>
                  <span className="shine-sweep" />
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-light-100/70 text-sm"
          >
            {isSignIn ? "No account yet?" : "Have an account already?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="font-bold text-primary-200 ml-1.5 hover:text-white transition-colors"
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthForm;
