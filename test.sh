set -e
set -x

pwd
echo foo
true
echo bar
if false; then
  echo succeeded
then
  echo failed
fi
echo qux
true
