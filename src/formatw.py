for i in range(520, -8, -8):
  print '0x{:02x},'.format(int(y >> i) & 0xff),
