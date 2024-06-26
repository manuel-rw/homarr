"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, PasswordInput, rem, Stack, TextInput } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

import { signIn } from "@homarr/auth/client";
import { useZodForm } from "@homarr/form";
import { showErrorNotification, showSuccessNotification } from "@homarr/notifications";
import { useScopedI18n } from "@homarr/translation/client";
import type { z } from "@homarr/validation";
import { validation } from "@homarr/validation";

export const LoginForm = () => {
  const t = useScopedI18n("user");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const form = useZodForm(validation.user.signIn, {
    initialValues: {
      name: "",
      password: "",
    },
  });

  const handleSubmitAsync = async (values: z.infer<typeof validation.user.signIn>) => {
    setIsLoading(true);
    setError(undefined);
    await signIn("credentials", {
      ...values,
      redirect: false,
      callbackUrl: "/",
    })
      .then((response) => {
        if (!response?.ok || response.error) {
          throw response?.error;
        }

        showSuccessNotification({
          title: t("action.login.notification.success.title"),
          message: t("action.login.notification.success.message"),
        });
        router.push("/");
      })
      .catch((error: Error | string) => {
        setIsLoading(false);
        setError(error.toString());
        showErrorNotification({
          title: t("action.login.notification.error.title"),
          message: t("action.login.notification.error.message"),
        });
      });
  };

  return (
    <Stack gap="xl">
      <form onSubmit={form.onSubmit((values) => void handleSubmitAsync(values))}>
        <Stack gap="lg">
          <TextInput label={t("field.username.label")} {...form.getInputProps("name")} />
          <PasswordInput label={t("field.password.label")} {...form.getInputProps("password")} />
          <Button type="submit" fullWidth loading={isLoading}>
            {t("action.login.label")}
          </Button>
        </Stack>
      </form>

      {error && (
        <Alert icon={<IconAlertTriangle size={rem(16)} />} color="red">
          {error}
        </Alert>
      )}
    </Stack>
  );
};
