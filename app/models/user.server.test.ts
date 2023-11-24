import { decryptToken, encryptToken } from './user.server';

test("test token encrypt/decrypt", () => {
  var message = "hello there chris";
  var encrypted = encryptToken(message);

  expect(message === encrypted).toBe(false);

  var decrypted = decryptToken(encrypted);
  expect(message === decrypted).toBe(true);
});

